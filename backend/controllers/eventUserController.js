const eventUserService = require("../services/eventUserService");
const AppError = require("../utils/errorClass");

class EventUserController {
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

  async listUserEvents(req, res, next) {
    try {
      const userId = req.params.userId;

      if (!userId) {
        throw new AppError("User ID is required.", 400);
      }

      const { dateFrom, dateTo, name } = req.query;

      const events = await eventUserService.listEventsByUser(userId, {
        dateFrom,
        dateTo,
        name,
      });

      res.status(200).json({ events });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
}

module.exports = new EventUserController();
