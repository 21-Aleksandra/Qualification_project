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

router.put(
  "/:id/edit",
  authChecker,
  roleChecker([Roles.ADMIN]),
  missionController.editMission
);

router.get(
  "/:id/get",
  authChecker,
  roleChecker([Roles.ADMIN]),
  missionController.getOneMission
);

module.exports = router;
