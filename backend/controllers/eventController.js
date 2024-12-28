const eventService = require("../services/eventService");
const AppError = require("../utils/errorClass");

/**
 * Controller for handling event crud operations
 * @class EventController
 */
class EventController {
  /**
   * Retrieves a filtered list of events based on query parameters.
   * If user is gaving manager role, he will recieve only his authored events
   * On success, it returns a 200 status with the events details.
   *
   * @async
   * @param {Object} req - Express request object containing query parameters for filters.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @returns {Promise<void>}
   */
  async getEventFilteredList(req, res, next) {
    try {
      // Build the filter object from query parameters
      const filters = {
        name: req.query.name || "",
        cities: req.query.cities
          ? req.query.cities.split(",").map((city) => city.trim())
          : [],
        countries: req.query.countries
          ? req.query.countries.split(",").map((country) => country.trim())
          : [],
        subsidiaryIds: req.query.subsidiaryIds
          ? req.query.subsidiaryIds.split(",").map((id) => id.trim())
          : [],
        typeIds: req.query.typeIds
          ? req.query.typeIds.split(",").map((id) => id.trim())
          : [],
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        applicationDeadline: req.query.applicationDeadline,
        sortBy: req.query.sortBy || "createdAt",
        sortOrder: req.query.sortOrder || "desc",
        userId: req.query.userId,
        userRoles: req.query.userRoles
          ? req.query.userRoles.split(",").map((role) => Number(role.trim()))
          : [],
      };

      const events = await eventService.getEventFilteredList(filters);

      res.status(200).json(events);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  /**
   * Retrieves a single event by its ID.
   * On success, it returns a 200 status with the event details.
   * User roles and user ID are primary needed for disabling manager access to not their events
   *
   * @async
   * @param {Object} req - Express request object containing the event ID in the parameters.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} -  Error of status 400 If no id provided
   * @returns {Promise<void>}
   */
  async getEventById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.query.userId;
      const userRoles = req.query.userRoles;
      if (!id) {
        throw new AppError("Eevent ID is required", 400);
      }

      const event = await eventService.getEventById(id, userId, userRoles);

      res.status(200).json(event);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves a list of event names based on the user ID and roles.
   * On success, it returns a 200 status with the event details.
   * If user is gaving manager role, he will recieve only his authored event names
   *
   * @async
   * @param {Object} req - Express request object containing user information in the query.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @returns {Promise<void>}
   */
  async getEventNamesList(req, res, next) {
    try {
      const { userId, userRoles } = req.query;
      let rolesArray;
      if (userRoles) {
        rolesArray = userRoles
          ? userRoles.split(",").map((role) => Number(role))
          : [];
      }

      const events = await eventService.findEventNames(userId, rolesArray);

      res.status(200).json(events);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Allows clients to create a new event, including event details such as
   * name, description, dates, and associated photos.
   * On success, it returns a 201 status with the event details.
   *
   * @async
   * @param {Object} req - Express request object containing event data in the body and photo files.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} -  Error of status 400 If no name or managerId provided
   * @returns {Promise<void>}
   */
  async addEvent(req, res, next) {
    try {
      const {
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
      } = req.body;

      if (!name || !managerId) {
        throw new AppError("ManagedId and name are required", 400);
      }

      let bannerPhoto = null;
      let otherPhotos = [];

      // Ensure req.files is defined before accessing it
      if (req.files) {
        if (req.files.bannerPhoto) {
          bannerPhoto = req.files.bannerPhoto[0]; // First file for 'bannerPhoto'
        }
        if (req.files.otherPhotos) {
          otherPhotos = req.files.otherPhotos; // Array of 'otherPhotos'
        }
      }

      const newEvent = await eventService.addEvent({
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
      });

      res.status(201).json(newEvent);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Allows clients to update an existing event by its ID, modifying its details like
   * name, type, description, dates, and photos.
   * On success, it returns a 200 status with the event details.
   *
   * @async
   * @param {Object} req - Express request object containing event ID in the parameters and updated data in the body.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} -  Error of status 400 If no name or id provided
   * @returns {Promise<void>}
   */
  async editEvent(req, res, next) {
    try {
      const { id } = req.params;
      const {
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
      } = req.body;

      let bannerPhoto = null;
      let otherPhotos = [];

      // Ensure req.files is defined before accessing it
      if (req.files) {
        if (req.files.bannerPhoto) {
          bannerPhoto = req.files.bannerPhoto[0]; // First file for 'bannerPhoto'
        }
        if (req.files.otherPhotos) {
          otherPhotos = req.files.otherPhotos; // Array of 'otherPhotos'
        }
      }

      if (!id) {
        throw new AppError("Subsidiary ID is required", 400);
      }

      if (!name || name == "") {
        throw new AppError("Name is required", 400);
      }
      let userId = req.session.user.id;

      const updatedEvent = await eventService.editEvent(id, {
        name,
        typeId,
        description,
        dateFrom,
        dateTo,
        publishOn,
        applicationDeadline,
        addressId,
        subsidiaryId,
        maxPeopleAllowed,
        bannerPhoto,
        otherPhotos,
        userId,
      });

      res.status(200).json(updatedEvent);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Allows clients to delete one or more events by providing an array of event IDs.
   * On success, it returns a 200 status with the deleted event count message.
   *
   * @async
   * @param {Object} req - Express request object containing the list of event IDs in the body.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} -  Error of status 400  If no ids provided or ids are not array
   * @returns {Promise<void>}
   */
  async deleteEvents(req, res, next) {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new AppError("A valid array of event IDs is required", 400);
      }

      const result = await eventService.deleteEvents(ids);
      res
        .status(200)
        .json({ message: `Successfully deleted ${result} events` });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new EventController();
