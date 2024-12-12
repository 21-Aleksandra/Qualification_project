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
} = require("../models");
const AppError = require("../utils/errorClass");
const EmailService = require("./emailService");
const Roles = require("../enums/roles");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");
const { savePhoto } = require("../utils/photoUtils");

class EventService {
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
          as: "Participants",
          through: {
            attributes: [],
          },
          attributes: ["id", "username"],
        },
        {
          model: User,
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

    const registeredUserCount = await Event_User.count({
      where: { eventId: id },
    });

    return {
      ...event.toJSON(),
      registeredUserCount,
    };
  }

  async addEvent({
    authorId,
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

    const newEvent = await Event.create({
      authorId,
      name,
      description,
      typeId,
      dateFrom: parsedDateFrom,
      dateTo: parsedDateTo,
      publishOn: parsedPublishOn,
      applicationDeadline: parsedApplicationDeadline,
      addressId,
      subsidiaryId,
      maxPeopleAllowed,
      photoSetId: photoSet.id,
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

    const parsedTypeId = typeId && typeId !== "" ? typeId : null;
    const parsedDescription =
      description && description !== "" ? description : null;
    const parsedAddressId = addressId && addressId !== "" ? addressId : null;
    const parsedSubsidiaryId =
      subsidiaryId && subsidiaryId !== "" ? subsidiaryId : null;
    const parsedMaxPeopleAllowed =
      maxPeopleAllowed && !isNaN(maxPeopleAllowed)
        ? parseInt(maxPeopleAllowed)
        : null;

    await event.update({
      name,
      description: parsedDescription,
      typeId: parsedTypeId,
      dateFrom: parsedDateFrom,
      dateTo: parsedDateTo,
      publishOn: parsedPublishOn,
      applicationDeadline: parsedApplicationDeadline,
      addressId: parsedAddressId,
      subsidiaryId: parsedSubsidiaryId,
      maxPeopleAllowed: parsedMaxPeopleAllowed,
    });

    const existingBannerPhoto = await Photo.findOne({
      where: { photoSetId: event.photoSetId, isBannerPhoto: true },
    });

    const parentDir = path.resolve(__dirname, "..");

    if (bannerPhoto) {
      if (
        !existingBannerPhoto ||
        existingBannerPhoto.filename !== bannerPhoto.originalname
      ) {
        if (existingBannerPhoto) {
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
      await fs.promises.unlink(
        path.join(parentDir, `${existingBannerPhoto.url}`)
      );
      await existingBannerPhoto.destroy();
    }

    const existingOtherPhotos = await Photo.findAll({
      where: { photoSetId: event.photoSetId, isBannerPhoto: false },
    });

    const existingFilenames = existingOtherPhotos.map(
      (photo) => photo.filename
    );
    const incomingFilenames = otherPhotos
      ? otherPhotos.map((photo) => photo.originalname)
      : [];

    const photosToDelete = existingOtherPhotos.filter(
      (photo) => !incomingFilenames.includes(photo.filename)
    );
    for (const photo of photosToDelete) {
      await fs.promises.unlink(path.join(parentDir, `${photo.url}`));
      await photo.destroy();
    }

    const photosToAdd = otherPhotos
      ? otherPhotos.filter(
          (photo) => !existingFilenames.includes(photo.originalname)
        )
      : [];

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

  async deleteEvents(ids) {
    const events = await Event.findAll({
      where: { id: { [Op.in]: ids } },
      include: [{ model: Photo_Set, include: [Photo] }],
    });

    if (events.length === 0) {
      throw new AppError("No events found with the provided IDs", 404);
    }

    const parentDir = path.resolve(__dirname, "..");

    for (const event of events) {
      if (event.Photo_Set && event.Photo_Set.Photos) {
        for (const photo of event.Photo_Set.Photos) {
          const photoPath = path.join(parentDir, photo.url);
          if (fs.existsSync(photoPath)) {
            await fs.promises.unlink(photoPath);
          }
          await photo.destroy();
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
}

module.exports = new EventService();
