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

// Supports file upload only for 'bannerPhoto' and 'otherPhotos'
// for security and readability reasons
router.post(
  "/add",
  authChecker,
  roleChecker([Roles.MANAGER]),
  upload.fields([{ name: "bannerPhoto" }, { name: "otherPhotos" }]),

  eventController.addEvent
);

// Supports file upload only for 'bannerPhoto' and 'otherPhotos'
// for security and readability reasons
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

router.get("/get/names", authChecker, eventController.getEventNamesList);

module.exports = router;
