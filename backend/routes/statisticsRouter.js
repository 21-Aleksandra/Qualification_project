const Router = require("express");
const router = new Router();
const statisticsController = require("../controllers/statisticsController");

router.get("/achievements", statisticsController.getAchievementSummary);

module.exports = router;
