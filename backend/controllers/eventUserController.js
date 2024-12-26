const eventUserService = require("../services/eventUserService");
const AppError = require("../utils/errorClass");

/**
 * Controller for handling user-event interactions, such as registering, unregistering, and listing events a user is involved in.
 * @class EventUserController
 */
class EventUserController {
  /**
   * Registers a user for a specific event.
   * This method checks that both the event ID and user ID are provided in the request body.
   * Sends a 201 status with a success message if registration is successful.
   *
   * @async
   * @param {Object} req - Express request object, containing event and user IDs in the body.
   * @param {Object} res - Express response object, returning a success message upon successful registration.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if no event ID or user ID is provided.
   * @returns {Promise<void>}
   */
  async register(req, res, next) {
    try {
      const { eventId, userId } = req.body;

      if (!eventId || !userId) {
        throw new AppError("Event and User ID are required.", 400);
      }

      await eventUserService.register(userId, eventId);
      res
        .status(201)
        .json({ message: "User successfully registered for the event." });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  /**
   * Unregisters a user from a specific event.
   * This method verifies that both the event ID and user ID are included in the request body.
   * Sends a 200 status with a success message if unregistration is successful.
   *
   * @async
   * @param {Object} req - Express request object, containing event and user IDs in the body.
   * @param {Object} res - Express response object, returning a success message upon successful unregistration.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if no event ID or user ID is provided.
   * @returns {Promise<void>}
   */
  async unregister(req, res, next) {
    try {
      const { eventId, userId } = req.body;

      if (!eventId || !userId) {
        throw new AppError("Event and User ID are required.", 400);
      }
      await eventUserService.unregister(userId, eventId);
      res
        .status(200)
        .json({ message: "User successfully unregistered from the event." });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  /**
   * Lists all events a specific user is registered for.
   * This method allows filtering the events by optional query parameters such as date range or event name.
   * Sends a 200 status with the event details if the request is successful.
   *
   * @async
   * @param {Object} req - Express request object, containing the user ID as a URL parameter and optional filters in the query string.
   * @param {Object} res - Express response object, which returns a list of events the user is registered for.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if no user ID is provided.
   * @returns {Promise<void>}
   */
  async listUserEvents(req, res, next) {
    try {
      const userId = req.params.userId;

      if (!userId) {
        throw new AppError("User ID is required.", 400);
      }

      const { dateFrom, dateTo, name } = req.query;

      // Build the filters based on query parameters
      const filters = {};
      if (dateFrom) filters.dateFrom = dateFrom;
      if (dateTo) filters.dateTo = dateTo;
      if (name) filters.name = name;

      const events = await eventUserService.listEventsByUser(userId, filters);

      res.status(200).json({ events });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
}

module.exports = new EventUserController();
