const { Event, Subsidiary, User, Role } = require("../models");
const Roles = require("../enums/roles");

class statisticsService {
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
