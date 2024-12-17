const statisticsService = require("../services/statisticsService");

class StatisticsController {
  async getAchievementSummary(req, res, next) {
    try {
      const summary = await statisticsService.getAchievementSummary();
      res.status(200).json(summary);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = new StatisticsController();
