const Router = require("express");
const router = new Router();
const statisticsController = require("../controllers/statisticsController");

// This route gets the total count of regular users, events, subsidiaries
router.get("/achievements", statisticsController.getAchievementSummary);

module.exports = router;
