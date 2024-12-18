const Router = require("express");
const router = new Router();
const profileController = require("../controllers/profileController");
const authChecker = require("../middlewares/authChecker");
const multer = require("multer");
const upload = multer();

router.post(
  "/change-profile-pic",
  authChecker,
  upload.fields([{ name: "profilePhoto" }]),
  profileController.changeProfilePic
);

router.put("/change-name", authChecker, profileController.changeName);

router.put("/change-password", authChecker, profileController.changePassword);

router.post(
  "/send-email-request",
  authChecker,
  profileController.sendEmailRequestToAdmin
);

router.delete("/delete-account", authChecker, profileController.deleteAccount);

module.exports = router;
