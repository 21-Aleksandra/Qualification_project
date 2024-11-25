const Router = require("express");
const router = new Router();
const missionController = require("../controllers/missionController");
const authChecker = require("../middlewares/authChecker");
const roleChecker = require("../middlewares/roleChecker");
const Roles = require("../enums/roles");

router.get("/list", authChecker, missionController.getMissionList);

router.post(
  "/add",
  authChecker,
  roleChecker([Roles.MANAGER, Roles.ADMIN]),
  missionController.addMission
);

module.exports = router;
