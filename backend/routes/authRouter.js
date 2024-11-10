const Router = require("express");
const router = new Router();
const authController = require("../controllers/authController");
const authChecker = require("../middlewares/authChecker");
const roleChecker = require("../middlewares/roleChecker");
const Roles = require("../enums/roles");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.delete("/logout", authController.logoutUser);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.get("/verify-email/:token", authController.verifyEmail);
router.get("/status", authController.checkStatus);

module.exports = router;
