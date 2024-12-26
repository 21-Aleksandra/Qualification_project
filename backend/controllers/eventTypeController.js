const eventTypeService = require("../services/eventTypeService");
const AppError = require("../utils/errorClass");

/**
 * Controller for handling event type create, add and edit operatioans as well as get operations.
 * @class EventTypeController
 */
class EventTypeController {
  /**
   * Retrieves a list of event types, optionally filtered by user ID and user roles.
   * If the user has a manager role, they will receive only the event types of their authored events.
   * On success, it returns a 200 status with the event types.
   *
   * @async
   * @param {Object} req - Express request object containing query parameters for user filtering, such as `userId` and `userRoles`.
   * @param {Object} res - Express response object, which returns the list of event types.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @returns {Promise<void>}
   */
  async getEventTypeList(req, res, next) {
    try {
      const { userId, userRoles } = req.query;
      const rolesArray = userRoles
        ? userRoles.split(",").map((role) => Number(role))
        : [];
      const eventTypes = await eventTypeService.getEventTypeList(
        userId,
        rolesArray
      );
      res.status(200).json({
        eventTypes,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  /**
   * Adds a new event type to the system.
   * On success, it returns a 201 status with the event type details and success message.
   *
   * @async
   * @param {Object} req - Express request object containing the name of the new event type in the body.
   * @param {Object} res - Express response object, which returns the newly created event type.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - If no name is provided in the request body.
   * @returns {Promise<void>}
   */
  async addEventType(req, res, next) {
    try {
      const { name } = req.body;

      if (!name) {
        throw new AppError("Name is a required field.", 400);
      }
      const newEventType = await eventTypeService.addEventType(name);

      res.status(201).json({
        message: "Event type added successfully",
        eventType: newEventType,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Edits an existing event type by its ID.
   * On success, it returns a 200 status with the event type details.
   *
   * @async
   * @param {Object} req - Express request object containing the event type ID in the parameters and updated data in the body.
   * @param {Object} res - Express response object, which returns the updated event type.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - If no update data is provided or if the event type is not found.
   * @returns {Promise<void>}
   */
  async editEventType(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!updateData || Object.keys(updateData).length === 0) {
        throw new AppError("No data provided for update", 400);
      }

      const updatedEventType = await eventTypeService.editEventType(
        id,
        updateData
      );
      if (!updatedEventType) {
        throw new AppError("Event type not found", 404);
      }

      res.status(200).json(updatedEventType);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves the details of a specific event type based on its ID.
   * On success, it returns a 200 status with the event type details.
   *
   * @async
   * @param {Object} req - Express request object containing the event type ID in the parameters.
   * @param {Object} res - Express response object, which returns the event type details.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - If the event type is not found.
   * @returns {Promise<void>}
   */
  async getOneEventType(req, res, next) {
    try {
      const { id } = req.params;

      const eventType = await eventTypeService.getOneEventType(id);
      if (!eventType) {
        throw new AppError("Event type not found", 404);
      }
      res.status(200).json(eventType);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new EventTypeController();
