const Router = require("express");
const router = new Router();
const eventUserController = require("../controllers/eventUserController");
const authChecker = require("../middlewares/authChecker");
const roleChecker = require("../middlewares/roleChecker");
const Roles = require("../enums/roles");

router.post("/register", eventUserController.register);

router.delete("/unregister", eventUserController.unregister);

router.get("/list/:userId", eventUserController.listUserEvents);

module.exports = router;
