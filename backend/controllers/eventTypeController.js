const eventTypeService = require("../services/eventTypeService");
const AppError = require("../utils/errorClass");

class EventTypeController {
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
