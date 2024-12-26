const { Event, Subsidiary, User, Role } = require("../models");
const Roles = require("../enums/roles");

/**
 * Service for generating statistics and summaries.
 * Provides methods to retrieve counts and summaries of users, events, and subsidiaries.
 * @class statisticsService
 */
class statisticsService {
  /**
   * Retrieves a summary of achievements including the number of regular users, events, and subsidiaries.
   * @async
   * @returns {Promise<Object>} - An object containing titles and counts for users, events, and subsidiaries.
   */
  async getAchievementSummary() {
    const regularUserCount = await User.count({
      include: [
        {
          model: Role,
          where: { id: Roles.REGULAR },
        },
      ],
      distinct: true,
    });

    const eventCount = await Event.count();

    const subsidiaryCount = await Subsidiary.count();

    return {
      users: { title: "Users", count: regularUserCount },
      events: { title: "Events", count: eventCount },
      subsidiaries: { title: "Subsidiaries", count: subsidiaryCount },
    };
  }
}

module.exports = new statisticsService();
