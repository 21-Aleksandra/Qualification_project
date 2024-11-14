const AppError = require("../utils/errorClass");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const AuthService = require("../services/authService");
const { createClient } = require("redis");
const redisClient = createClient();

redisClient
  .connect()
  .catch((e) => console.log("Could not connect to Redis", e));

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

      const { user, roles } = await AuthService.loginUser(email, password);

      const previousSessionId = await redisClient.get(`user:${user.id}`);
      if (previousSessionId) {
        await redisClient.del(`sess:${previousSessionId}`);
      }

      req.session.regenerate(async (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Session regeneration error" });
        }

        req.session.logged_in = true;
        req.session.user = {
          id: user.id,
          username: user.username,
          roles: roles,
        };

        await redisClient.set(`user:${user.id}`, req.session.id);

        return res.status(200).json({
          message: "Login successful",
          username: user.username,
          roles: roles,
        });
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

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await AuthService.passwordMail(email);
      return res.status(200).json({ message: "Password email sent!" });
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const token = req.params.token;
      const { newPassword } = req.body;
      await AuthService.resetPassword(token, newPassword);
      return res.status(200).json({ message: "Password updated!" });
    } catch (err) {
      next(err);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const token = req.params.token;
      await AuthService.verifyEmail(token);
      return res.redirect(process.env.FRONTEND_URL);
    } catch (err) {
      next(err);
    }
  }

  async checkStatus(req, res, next) {
    try {
      if (req.session.user) {
        res.json({
          isAuthenticated: true,
          roles: req.session.user.roles,
          username: req.session.user.username,
        });
      } else {
        res.json({
          isAuthenticated: false,
          roles: [],
          username: null,
        });
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
