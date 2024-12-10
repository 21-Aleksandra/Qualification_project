const Router = require("express");
const router = new Router();
const eventController = require("../controllers/eventController");
const authChecker = require("../middlewares/authChecker");
const roleChecker = require("../middlewares/roleChecker");
const Roles = require("../enums/roles");
const multer = require("multer");
const upload = multer();

router.get("/list", eventController.getEventFilteredList);
router.get("/:id", eventController.getEventById);

router.post(
  "/add",
  upload.fields([{ name: "bannerPhoto" }, { name: "otherPhotos" }]),

  eventController.addEvent
);

router.put(
  "/:id/edit",
  upload.fields([{ name: "bannerPhoto" }, { name: "otherPhotos" }]),

  eventController.editEvent
);

router.delete("/delete", eventController.deleteEvents);

module.exports = router;
