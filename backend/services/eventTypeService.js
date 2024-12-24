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

  async editEventType(id, updateData) {
    const existingEventType = await Event_Type.findByPk(id);
    if (!existingEventType) {
      return null;
    }

    const changedFields = {};
    for (const key in updateData) {
      if (
        updateData[key] !== undefined &&
        updateData[key] !== existingEventType[key]
      ) {
        changedFields[key] = updateData[key];
      }
    }

    if (Object.keys(changedFields).length === 0) {
      return existingEventType; // No changes applied, but return existing entry
    }

    await existingEventType.update(changedFields);
    return existingEventType;
  }

  async getOneEventType(id) {
    return await Event_Type.findByPk(id);
  }
}

module.exports = new EventTypeService();
