const {
  Event,
  Address,
  Photo_Set,
  Photo,
  Role,
  Event_Type,
  Subsidiary,
  User,
  Event_User,
  Comment_Set,
  News_Set,
} = require("../models");
const AppError = require("../utils/errorClass");
const EmailService = require("./emailService");
const Roles = require("../enums/roles");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");
const { savePhoto } = require("../utils/photoUtils");

/**
 * A service class for managing events in the application.
 * This class includes logic for creating, retrieving,
 * updating, and deleting event-related data.
 * @class EventService
 */
class EventService {
  /**
   * Retrieves a filtered list of events based on the provided filters.
   * If the user is a manager, only returns events related to that specific user.
   * @async
   * @param {Object} filters - The filters to apply when querying events.
   * @returns {Promise<Array>} - A list of events matching the given filters(name, cities, countries, subsidiary IDs, type IDs etc.).
   * @throws {Error} - If manager user do not exist in databases for some reason.
   */
  async getEventFilteredList(filters = {}) {
    const {
      name,
      cities,
      countries,
      subsidiaryIds,
      typeIds,
      dateFrom,
      dateTo,
      applicationDeadline,
      sortBy,
      sortOrder,
      userId,
      userRoles,
    } = filters;

    const whereConditions = {};
    const addressConditions = {};
    const typeConditions = {};
    const subsidiaryConditions = {};

    // Applying filters to the query conditions.
    if (name) whereConditions.name = { [Op.like]: `%${name}%` };
    if (cities?.length) addressConditions.city = { [Op.in]: cities };
    if (countries?.length) addressConditions.country = { [Op.in]: countries };
    if (subsidiaryIds?.length)
      subsidiaryConditions.id = { [Op.in]: subsidiaryIds };
    if (typeIds?.length) typeConditions.id = { [Op.in]: typeIds };
    if (dateFrom) {
      whereConditions.dateFrom = { [Op.gte]: new Date(dateFrom) };
    }
    if (dateTo) {
      whereConditions.dateTo = { [Op.lte]: new Date(dateTo) };
    }
    if (applicationDeadline) {
      whereConditions.applicationDeadline = {
        [Op.lte]: new Date(applicationDeadline),
      };
    }

    const validSortFields = [
      "name",
      "dateFrom",
      "dateTo",
      "createdAt",
      "updatedAt",
    ];
    const orderBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const order = ["asc", "desc"].includes(sortOrder) ? sortOrder : "desc";

    const events = await Event.findAll({
      where: whereConditions,
      include: [
        {
          model: Address,
          attributes: ["city", "country", "street", "lat", "lng"],
          where: Object.keys(addressConditions).length
            ? addressConditions
            : undefined,
        },
        {
          model: Photo_Set,
          attributes: ["id"],
          include: [{ model: Photo, attributes: ["url", "isBannerPhoto"] }],
        },
        {
          model: Event_Type,
          attributes: ["id", "name"],
          where: Object.keys(typeConditions).length
            ? typeConditions
            : undefined,
        },
        {
          model: Subsidiary,
          attributes: ["id", "name"],
          where: Object.keys(subsidiaryConditions).length
            ? subsidiaryConditions
            : undefined,
        },
        {
          model: User,
          as: "Author",
          attributes: ["id", "username"],
        },
      ],
      order: [[orderBy, order]],
    });

    if (userId != null && userRoles && userRoles.includes(Roles.MANAGER)) {
      const user = await User.findByPk(userId, {
        include: {
          model: Role,
          attributes: ["id", "rolename"],
          where: { id: { [Op.in]: userRoles } },
        },
      });

      if (!user) {
        throw new AppError("User with specified role not found", 404);
      }

      return events.filter((event) => event.authorId === Number(userId));
    }

    return events;
  }

  /**
   * Fetches detailed information about a specific event by its ID.
   * @async
   * @param {number} id - The ID of the event to fetch.
   * @param {number} userId - The ID of the currently authenticated user.
   * @param {Array} userRoles - The roles of the current user.
   * @returns {Promise<Object>} - Detailed event information, including registered users count.
   * @throws {Error} - If the event does not exist or user does not have permission.
   */
  async getEventById(id, userId, userRoles) {
    const event = await Event.findOne({
      where: { id },
      include: [
        {
          model: Address,
          attributes: ["city", "country", "street", "lat", "lng"],
        },
        {
          model: Photo_Set,
          attributes: ["id"],
          include: [
            {
              model: Photo,
              attributes: ["url", "isBannerPhoto"],
            },
          ],
        },
        {
          model: Event_Type,
          attributes: ["id", "name"],
        },
        {
          model: Subsidiary,
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "Participants", // finding regular users that participate in event
          through: {
            attributes: [],
          },
          attributes: ["id", "username"],
        },
        {
          model: User, // finding event authors
          as: "Author",
          attributes: ["id", "username"],
        },
      ],
    });

    if (!event) {
      throw new AppError(`Event with ID ${id} not found`, 404);
    }

    userRoles = userRoles.map((role) => Number(role));

    if (userId != null && userRoles && userRoles.includes(Roles.MANAGER)) {
      const user = await User.findByPk(userId, {
        include: {
          model: Role,
          attributes: ["id", "rolename"],
          where: { id: { [Op.in]: userRoles } },
        },
      });

      if (!user) {
        throw new AppError("User with specified role not found", 404);
      }

      if (event.authorId !== Number(userId)) {
        throw new AppError("You are not allowed to access this event", 403);
      }
    }

    // Count the number of users registered for the event to manage registration to it further
    const registeredUserCount = await Event_User.count({
      where: { eventId: id },
    });

    return {
      ...event.toJSON(),
      registeredUserCount,
    };
  }

  /**
   * Adds a new event to the database.
   * Handles event creation, photo processing (banner and other photos), and validation of datetime fields.
   *
   * @async
   * @param {number} managerId - The ID of the manager creating the event.
   * @param {string} name - The name of the event.
   * @param {string} description - A detailed description of the event.
   * @param {number} typeId - The ID of the event type.
   * @param {Date} dateFrom - The start date and time of the event.
   * @param {Date} dateTo - The end date and time of the event.
   * @param {Date} publishOn - The date and time when the event should be published.
   * @param {Date} applicationDeadline - The cutoff date and time for event registrations or applications.
   * @param {number} addressId - The ID of the address where the event will take place.
   * @param {number} subsidiaryId - The ID of the subsidiary organizing or hosting the event.
   * @param {number} maxPeopleAllowed - The maximum number of participants allowed for the event.
   * @param {Object} bannerPhoto - A URL or file path for the main banner photo of the event.
   * @param {Array<Object>} otherPhotos - A list of additional photos related to the event.
   *
   * @returns {Promise<Object>} - The newly created event object.
   * @throws {Error} - If there are issues during event creation or photo processing (e.g., exceeding the maximum count of photos).
   */
  async addEvent({
    managerId,
    name,
    description,
    typeId,
    dateFrom,
    dateTo,
    publishOn,
    applicationDeadline,
    addressId,
    subsidiaryId,
    maxPeopleAllowed,
    bannerPhoto,
    otherPhotos,
  }) {
    const parsedDateFrom = dateFrom ? new Date(dateFrom) : null;
    const parsedDateTo = dateTo ? new Date(dateTo) : null;
    const parsedApplicationDeadline = applicationDeadline
      ? new Date(applicationDeadline)
      : null;
    const parsedPublishOn = publishOn ? new Date(publishOn) : null;

    if (
      (dateFrom && isNaN(parsedDateFrom)) ||
      (dateTo && isNaN(parsedDateTo)) ||
      (applicationDeadline && isNaN(parsedApplicationDeadline)) ||
      (publishOn && isNaN(parsedPublishOn))
    ) {
      throw new AppError("Invalid datetime values provided", 400);
    }

    const photoSet = await Photo_Set.create({});
    if (!photoSet) {
      throw new AppError("Failed to create Photo_Set", 500);
    }

    const newsSet = await News_Set.create({});
    if (!photoSet) {
      throw new AppError("Failed to create News_Set", 500);
    }

    const commentSet = await Comment_Set.create({});
    if (!photoSet) {
      throw new AppError("Failed to create Comment_Set", 500);
    }

    const newEvent = await Event.create({
      name,
      description,
      typeId,
      dateFrom: parsedDateFrom,
      dateTo: parsedDateTo,
      publishOn: parsedPublishOn,
      applicationDeadline: parsedApplicationDeadline,
      addressId,
      subsidiaryId,
      authorId: managerId,
      maxPeopleAllowed,
      photoSetId: photoSet.id,
      newsSetId: newsSet.id,
      commentSetId: commentSet.id,
    });

    if (!newEvent) {
      throw new AppError("Failed to add event", 500);
    }

    const photosDirectory =
      process.env.EVENT_IMAGE_PATH || "static/eventPhotos";
    if (!fs.existsSync(photosDirectory)) {
      fs.mkdirSync(photosDirectory, { recursive: true });
    }

    if (bannerPhoto) {
      await savePhoto(bannerPhoto, true, photosDirectory, photoSet.id);
    }

    if (otherPhotos && Array.isArray(otherPhotos)) {
      if (otherPhotos.length > 3) {
        throw new AppError("Cannot upload more than 3 other photos.", 400);
      }
      for (const photo of otherPhotos) {
        await savePhoto(photo, false, photosDirectory, photoSet.id);
      }
    }

    return newEvent;
  }

  /**
   * Updates an existing event in the database.
   * Handles detecting changes in the event's fields and appropriately updates them.
   * If new photos are provided, they are uploaded, and old photos are deleted.
   * After updating the event, all registered users are notified via email about the update.
   *
   * @async
   * @param {string} id - The unique identifier of the event to be updated.
   * @param {string} [name] - The updated name of the event.
   * @param {string} [description] - The updated description of the event.
   * @param {number} [typeId] - The updated ID of the event type.
   * @param {Date} [dateFrom] - The updated start date and time of the event.
   * @param {Date} [dateTo] - The updated end date and time of the event.
   * @param {Date} [publishOn] - The updated date and time for publishing the event.
   * @param {Date} [applicationDeadline] - The updated cutoff date and time for registrations.
   * @param {number} [addressId] - The updated ID of the event location.
   * @param {number} [subsidiaryId] - The updated ID of the subsidiary organizing the event.
   * @param {number} [maxPeopleAllowed] - The updated maximum number of participants allowed.
   * @param {Object} [bannerPhoto] - A new banner photo file  for the event.
   * @param {Array<Object>} [otherPhotos] - A list of new additional photos for the event.
   *
   * @returns {Promise<Object>} - The updated event object.
   * @throws {AppError} - If the event is not found or issues occur during photo uploads or updates.
   */
  async editEvent(
    id,
    {
      name,
      description,
      typeId,
      dateFrom,
      dateTo,
      publishOn,
      applicationDeadline,
      addressId,
      subsidiaryId,
      maxPeopleAllowed,
      bannerPhoto,
      otherPhotos,
    }
  ) {
    const event = await Event.findByPk(id);
    if (!event) {
      throw new AppError(`Event with ID ${id} not found`, 404);
    }

    const parsedFields = {
      description: description && description !== "" ? description : null,
      typeId: typeId && typeId !== "" ? typeId : null,
      addressId: addressId && addressId !== "" ? addressId : null,
      subsidiaryId: subsidiaryId && subsidiaryId !== "" ? subsidiaryId : null,
      maxPeopleAllowed:
        maxPeopleAllowed && !isNaN(maxPeopleAllowed)
          ? parseInt(maxPeopleAllowed, 10)
          : null,
      dateFrom: dateFrom ? new Date(dateFrom) : null,
      dateTo: dateTo ? new Date(dateTo) : null,
      applicationDeadline: applicationDeadline
        ? new Date(applicationDeadline)
        : null,
      publishOn: publishOn ? new Date(publishOn) : null,
    };

    if (
      (dateFrom && isNaN(parsedFields.dateFrom)) ||
      (dateTo && isNaN(parsedFields.dateTo)) ||
      (applicationDeadline && isNaN(parsedFields.applicationDeadline)) ||
      (publishOn && isNaN(parsedFields.publishOn))
    ) {
      throw new AppError("Invalid datetime values provided", 400);
    }
    // Preparing the update fields object dynamically by filtering out undefined or null values
    const updateFields = {};
    Object.entries({
      name,
      ...parsedFields,
    }).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        updateFields[key] = value;
      }
    });

    await event.update(updateFields);
    const existingBannerPhoto = await Photo.findOne({
      where: { photoSetId: event.photoSetId, isBannerPhoto: true },
    });

    const parentDir = path.resolve(__dirname, "..");

    // If a new banner photo is provided, check if it needs to be replaced
    if (bannerPhoto) {
      if (
        !existingBannerPhoto ||
        existingBannerPhoto.filename !== bannerPhoto.originalname
      ) {
        if (existingBannerPhoto) {
          // if new photo
          await fs.promises.unlink(
            path.join(parentDir, `${existingBannerPhoto.url}`)
          );
          await existingBannerPhoto.destroy();
        }
        await savePhoto(
          bannerPhoto,
          true,
          process.env.EVENT_IMAGE_PATH,
          event.photoSetId
        );
      }
    } else if (existingBannerPhoto) {
      // if banner was deleted
      await fs.promises.unlink(
        path.join(parentDir, `${existingBannerPhoto.url}`)
      );
      await existingBannerPhoto.destroy();
    }

    const existingOtherPhotos = await Photo.findAll({
      where: { photoSetId: event.photoSetId, isBannerPhoto: false },
    });

    // Extract the filenames of existing and incoming photos to determine what needs to be deleted or added
    const existingFilenames = existingOtherPhotos.map(
      (photo) => photo.filename
    );
    const incomingFilenames = otherPhotos
      ? otherPhotos.map((photo) => photo.originalname)
      : [];

    // Identify photos that should be deleted (those that are no longer in the incoming list)
    const photosToDelete = existingOtherPhotos.filter(
      (photo) => !incomingFilenames.includes(photo.filename)
    );
    for (const photo of photosToDelete) {
      await fs.promises.unlink(path.join(parentDir, `${photo.url}`));
      await photo.destroy();
    }

    // Identify photos that should be added (those that are not already in the existing list)
    const photosToAdd = otherPhotos
      ? otherPhotos.filter(
          (photo) => !existingFilenames.includes(photo.originalname)
        )
      : [];

    // Ensure no more than 3 photos are uploaded (if there are more than 3 photos after the update)
    if (
      existingOtherPhotos.length - photosToDelete.length + photosToAdd.length >
      3
    ) {
      throw new AppError("Cannot upload more than 3 other photos.", 400);
    }

    for (const photo of photosToAdd) {
      await savePhoto(
        photo,
        false,
        process.env.EVENT_IMAGE_PATH,
        event.photoSetId
      );
    }

    const eventWithRegisteredUsers = await Event.findByPk(id, {
      attributes: ["name"],
      include: [
        {
          model: User,
          as: "Participants",
          through: {
            attributes: [],
          },
          attributes: ["email"],
        },
      ],
    });

    const eventName = eventWithRegisteredUsers.name;

    if (eventWithRegisteredUsers.Participants.length > 0) {
      const userEmails = eventWithRegisteredUsers.Participants.map(
        (Participants) => Participants.email
      );

      for (const email of userEmails) {
        await EmailService.SendMail(email, "eventChanges", eventName);
      }
    }

    return event;
  }

  /**
   * Deletes events and associated photos based on the provided IDs.
   * This method also sends email notifications to participants about event cancellation.
   * @async
   * @param {Array} ids - List of event IDs to be deleted.
   * @returns {Promise<number>} - The number of deleted events.
   * @throws {AppError} - Throws an error if no events are found for the provided IDs.
   */
  async deleteEvents(ids) {
    const events = await Event.findAll({
      where: { id: { [Op.in]: ids } },
      include: [{ model: Photo_Set, include: [Photo] }],
    });

    if (events.length === 0) {
      throw new AppError("No events found with the provided IDs", 404);
    }

    const parentDir = path.resolve(__dirname, "..");

    // Delete the photos associated with the events
    for (const event of events) {
      if (event.Photo_Set && event.Photo_Set.Photos) {
        for (const photo of event.Photo_Set.Photos) {
          const photoPath = path.join(parentDir, photo.url);
          if (fs.existsSync(photoPath)) {
            await fs.promises.unlink(photoPath);
          }
          await photo.destroy(); // Delete the photo record from the DB
        }
      }
    }

    for (const eventId of ids) {
      const event = await Event.findByPk(eventId, {
        attributes: ["name"],
        include: [
          {
            model: User,
            as: "Participants",
            through: {
              attributes: [],
            },
            attributes: ["email"],
          },
        ],
      });

      const eventName = event.name;

      if (event.Participants.length === 0) {
        console.log(`No users found for event with ID: ${eventId}`);
        continue;
      }

      const userEmails = event.Participants.map(
        (Participants) => Participants.email
      );

      for (const email of userEmails) {
        await EmailService.SendMail(email, "eventCanceled", eventName);
      }
    }

    const deletedCount = await Event.destroy({
      where: { id: { [Op.in]: ids } },
    });

    return deletedCount;
  }

  /**
   * Retrieves the comment set associated with a specific event by its ID.
   * @async
   * @param {string} id - ID of the event.
   * @returns {Promise<Comment_Set>} - The comment set associated with the event.
   * @throws {AppError} - Throws an error if the event or comment set is not found.
   */
  async getEventCommentSetById(id) {
    const event = await Event.findByPk(id);
    if (!event) {
      throw new AppError("Event not found", 404);
    }
    const commentSet = await Comment_Set.findByPk(event.commentSetId);

    if (!commentSet) {
      throw new AppError("Comment set not found for this event", 404);
    }

    return commentSet;
  }

  /**
   * Retrieves the news set associated with a specific event by its ID.
   * @async
   * @param {string} id - ID of the event.
   * @returns {Promise<News_Set>} - The news set associated with the event.
   * @throws {AppError} - Throws an error if the event or news set is not found.
   */
  async getEventNewsSetById(id) {
    const event = await Event.findByPk(id);

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    const newsSet = await News_Set.findByPk(event.newsSetId);

    if (!newsSet) {
      throw new AppError("News set not found for this event", 404);
    }

    return newsSet;
  }

  /**
   * Finds event names based on the user's ID and roles.
   * If the user is a manager, only events they authored are returned.
   * @async
   * @param {string} userId - ID of the user requesting the data.
   * @param {Array} userRoles - Array of roles associated with the user.
   * @returns {Promise<Array>} - List of event names matching the filters.
   */
  async findEventNames(userId, userRoles) {
    if (
      userId != null &&
      userRoles != null &&
      userRoles.includes(Roles.MANAGER)
    ) {
      return await Event.findAll({
        attributes: ["id", "name"],
        where: {
          authorId: userId, // Filter events by the user's author ID if they are a manager
        },
      });
    }

    return await Event.findAll({
      attributes: ["id", "name"],
    });
  }
}

module.exports = new EventService();
