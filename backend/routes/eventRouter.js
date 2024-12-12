const Router = require("express");
const router = new Router();
const eventController = require("../controllers/eventController");
const authChecker = require("../middlewares/authChecker");
const roleChecker = require("../middlewares/roleChecker");
const Roles = require("../enums/roles");
const multer = require("multer");
const upload = multer();

router.get("/list", authChecker, eventController.getEventFilteredList);
router.get("/:id", authChecker, eventController.getEventById);

router.post(
  "/add",
  authChecker,
  roleChecker([Roles.MANAGER]),
  upload.fields([{ name: "bannerPhoto" }, { name: "otherPhotos" }]),

  eventController.addEvent
);

router.put(
  "/:id/edit",
  authChecker,
  roleChecker([Roles.MANAGER]),
  upload.fields([{ name: "bannerPhoto" }, { name: "otherPhotos" }]),
  eventController.editEvent
);

router.delete(
  "/delete",
  authChecker,
  roleChecker([Roles.MANAGER]),
  eventController.deleteEvents
);

module.exports = router;
