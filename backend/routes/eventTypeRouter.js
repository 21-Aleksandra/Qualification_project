const Router = require("express");
const router = new Router();
const eventTypeController = require("../controllers/eventTypeController");
const authChecker = require("../middlewares/authChecker");
const roleChecker = require("../middlewares/roleChecker");
const Roles = require("../enums/roles");

router.get("/list", authChecker, eventTypeController.getEventTypeList);
router.post(
  "/add",
  authChecker,
  roleChecker([Roles.MANAGER]),
  eventTypeController.addEventType
);

router.put(
  "/:id/edit",
  authChecker,
  roleChecker([Roles.ADMIN]),
  eventTypeController.editEventType
);

router.get(
  "/:id/get",
  authChecker,
  roleChecker([Roles.ADMIN]),
  eventTypeController.getOneEventType
);

module.exports = router;
