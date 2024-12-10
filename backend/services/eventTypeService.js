const { Event_Type, Event, User } = require("../models");
const AppError = require("../utils/errorClass");
const Roles = require("../enums/roles");

class EventTypeService {
  async getEventTypeList(userId, userRoles) {
    let eventTypes;

    if (userRoles && userRoles.includes(Roles.MANAGER)) {
      eventTypes = await Event_Type.findAll({
        include: [
          {
            model: Event,
            where: { authorId: userId },
            attributes: [],
          },
        ],
        distinct: true,
        order: [["name", "ASC"]],
      });
    } else {
      eventTypes = await Event_Type.findAll({
        order: [["name", "ASC"]],
      });
    }

    return eventTypes;
  }

  async addEventType(name) {
    const MAX_LENGTH = 100;

    if (name.length > MAX_LENGTH) {
      throw new AppError(
        "Event type name exceeds the maximum length of 255 characters.",
        400
      );
    }

    const existingEventType = await Event_Type.findOne({
      where: { name },
    });

    if (existingEventType) {
      throw new AppError("Event Type with the same name already exists.", 400);
    }

    const newEventType = await Event_Type.create({ name });
    return newEventType;
  }
}

module.exports = new EventTypeService();
