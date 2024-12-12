const Router = require("express");
const router = new Router();
const eventUserController = require("../controllers/eventUserController");
const authChecker = require("../middlewares/authChecker");
const roleChecker = require("../middlewares/roleChecker");
const Roles = require("../enums/roles");

router.post(
  "/register",
  authChecker,
  roleChecker([Roles.REGULAR]),
  eventUserController.register
);

router.delete(
  "/unregister",
  authChecker,
  roleChecker([Roles.REGULAR]),
  eventUserController.unregister
);

router.get(
  "/list/:userId",
  authChecker,
  roleChecker([Roles.REGULAR]),
  eventUserController.listUserEvents
);

module.exports = router;
