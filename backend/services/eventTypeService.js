const { Event_Type, Event, User } = require("../models");
const AppError = require("../utils/errorClass");
const Roles = require("../enums/roles");
/**
 * Service for managing Event Types, including operations for fetching, adding, and editing event types.
 * @class EventTypeService
 */
class EventTypeService {
  /**
   * Retrieves a list of event types based on the user's role.
   * If the user is a manager, only event types related to events they authored are returned.
   * @async
   * @param {string} userId - The ID of the user making the request.
   * @param {Array} userRoles - Array of roles associated with the user.
   * @returns {Promise<Array>} - List of event types.
   */
  async getEventTypeList(userId, userRoles) {
    let eventTypes;

    // If the user is a manager, filter event types by events the manager has authored
    if (userRoles && userRoles.includes(Roles.MANAGER)) {
      eventTypes = await Event_Type.findAll({
        include: [
          {
            model: Event,
            where: { authorId: userId },
            attributes: [], // Don't return event attributes, just check for association
          },
        ],
        distinct: true,
        order: [["name", "ASC"]],
      });
    } else {
      // For other users, return all event types
      eventTypes = await Event_Type.findAll({
        order: [["name", "ASC"]],
      });
    }

    return eventTypes;
  }

  /**
   * Adds a new event type to the database.
   * Ensures that the event type name does not exceed the maximum allowed length and is unique.
   * @async
   * @param {string} name - The name of the event type to be added.
   * @returns {Promise<Event_Type>} - The newly created event type.
   * @throws {AppError} - Throws an error if the event type name exceeds the maximum length or already exists.
   */
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

  /**
   * Edits an existing event type's attributes.
   * Compares the current attributes with the new ones, and only updates the changed fields.
   * @async
   * @param {string} id - ID of the event type to be updated.
   * @param {Object} updateData - Object containing the new values for the event type.
   * @returns {Promise<Event_Type|null>} - The updated event type, or null if not found.
   */
  async editEventType(id, updateData) {
    const existingEventType = await Event_Type.findByPk(id);
    if (!existingEventType) {
      return null;
    }

    const changedFields = {};
    // Looping through each key in the updateData and compare with the current value
    for (const key in updateData) {
      if (
        updateData[key] !== undefined &&
        updateData[key] !== existingEventType[key]
      ) {
        changedFields[key] = updateData[key]; // setting for update if change spotted
      }
    }

    if (Object.keys(changedFields).length === 0) {
      return existingEventType; // No changes applied, but return existing entry
    }

    await existingEventType.update(changedFields);
    return existingEventType;
  }

  /**
   * Retrieves a single event type by its ID.
   * @async
   * @param {string} id - ID of the event type to be retrieved.
   * @returns {Promise<Event_Type>} - The event type corresponding to the given ID.
   */
  async getOneEventType(id) {
    return await Event_Type.findByPk(id);
  }
}

module.exports = new EventTypeService();
