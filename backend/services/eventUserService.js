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

class EventUserService {
  async register(userId, eventId) {
    const existingRegistration = await Event_User.findOne({
      where: { userId, eventId },
    });

    if (existingRegistration) {
      throw new AppError("User is already registered for this event.", 400);
    }

    await Event_User.create({ userId, eventId });
  }

  async unregister(userId, eventId) {
    const registration = await Event_User.findOne({
      where: { userId, eventId },
    });

    if (!registration) {
      throw new AppError("User is not registered for this event.", 404);
    }

    await registration.destroy();
  }

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
      attributes: ["id", "name", "description", "dateFrom", "dateTo"],
      include: [
        {
          model: User,
          as: "Participants",
          through: { attributes: [] },
          attributes: ["id", "username"],
          where: { id: userId },
          required: true,
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
