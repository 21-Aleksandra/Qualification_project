const statisticsService = require("../services/statisticsService");

/**
 * Controller for handling statistics-related actions such as retrieving achievement summaries.
 * @class StatisticsController
 */
class StatisticsController {
  /**
   * Retrieves the achievement summary.
   * Fetches a summary of achievements, including the total count of regular users,
   * events, and subsidiaries, from the statistics service.
   * Sends a status 200 response with the achievement summary data.
   *
   * @async
   * @param {Object} req - Express request object, containing any query parameters (if applicable).
   * @param {Object} res - Express response object used to return the achievement summary data.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @returns {Promise<void>}
   */
  async getAchievementSummary(req, res, next) {
    try {
      const summary = await statisticsService.getAchievementSummary();
      res.status(200).json(summary);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new StatisticsController();
