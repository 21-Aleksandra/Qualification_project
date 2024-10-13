const AppError = require("../utils/errorClass");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const AuthService = require("../services/auth-service");

class AuthController {
  async registerUser(req, res, next) {
    try {
      const { username, email, password } = req.body;

      const newUser = await AuthService.registerUser(username, email, password);

      res.status(201).json({
        message: "User registered successfully",
        username: newUser.username,
      });
    } catch (err) {
      next(err);
    }
  }

  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;

      const existingUser = await AuthService.loginUser(email, password);

      req.session.logged_in = true;
      req.session.user = {
        id: existingUser.id,
        role: existingUser.role,
      };

      return res.status(200).json({
        message: "Login successful",
        user: existingUser.email,
      });
    } catch (err) {
      next(err);
    }
  }

  async logoutUser(req, res, next) {
    try {
      req.session.destroy((err) => {
        if (err) {
          return next(
            AppError.internalError("Could not log out. Please try again.")
          );
        }

        res.clearCookie("sessionId");

        return res.status(200).json({ message: "Logout successful" });
      });
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req, res) {}

  async sendVerificationEmail(user, token) {}

  async verifyEmail(req, res) {}
}

module.exports = new AuthController();
