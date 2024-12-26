const {
  Event,
  User,
  Address,
  Photo_Set,
  Photo,
  Event_User,
} = require("../models");
const AppError = require("../utils/errorClass");
const { Op } = require("sequelize");

/**
 * Service for managing user registrations for events.
 * Handles registering, unregistering, and listing events a user is registered for.
 * @class EventUserService
 */
class EventUserService {
  /**
   * Registers a user for an event(adds row in event_user).
   * @async
   * @param {string} userId - ID of the user who wants to register.
   * @param {string} eventId - ID of the event the user wants to register for.
   * @throws {AppError} - Throws error if the user is already registered for the event.
   */
  async register(userId, eventId) {
    const existingRegistration = await Event_User.findOne({
      where: { userId, eventId },
    });

    if (existingRegistration) {
      throw new AppError("User is already registered for this event.", 400);
    }

    await Event_User.create({ userId, eventId });
  }

  /**
   * Unregisters a user from an event(deletes row in event_user).
   * @async
   * @param {string} userId - ID of the user who wants to unregister.
   * @param {string} eventId - ID of the event the user wants to unregister from.
   * @throws {AppError} - Throws error if the user is not registered for the event.
   */
  async unregister(userId, eventId) {
    const registration = await Event_User.findOne({
      where: { userId, eventId },
    });

    if (!registration) {
      throw new AppError("User is not registered for this event.", 404);
    }

    await registration.destroy();
  }

  /**
   * Lists all events a user is registered for, with optional filters.
   * Filters can include date range and event name.
   * @async
   * @param {string} userId - ID of the user whose events are being fetched.
   * @param {Object} filters - Optional filters for the event list.
   * @param {string} filters.dateFrom - Start date for filtering events.
   * @param {string} filters.dateTo - End date for filtering events.
   * @param {string} filters.name - Name filter for event title.
   * @returns {Promise<Array>} - List of events the user is registered for.
   */
  async listEventsByUser(userId, filters = {}) {
    const { dateFrom, dateTo, name } = filters;

    const whereClause = {};

    if (dateFrom) {
      whereClause.dateFrom = { ...whereClause.dateFrom, [Op.gte]: dateFrom };
    }
    if (dateTo) {
      whereClause.dateTo = { ...whereClause.dateTo, [Op.lte]: dateTo };
    }
    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }

    const events = await Event.findAll({
      where: whereClause,
      attributes: [
        "id",
        "name",
        "description",
        "dateFrom",
        "dateTo",
        "applicationDeadline",
      ],
      include: [
        {
          model: User,
          as: "Participants",
          through: { attributes: [] },
          attributes: ["id", "username"],
          where: { id: userId },
          required: true, // Ensuring the join is successful and present
        },
        {
          model: Address,
          attributes: ["city", "country", "street"],
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
      ],
      order: [["dateFrom", "ASC"]],
    });

    return events;
  }
}

module.exports = new EventUserService();
