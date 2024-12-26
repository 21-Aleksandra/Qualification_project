const AppError = require("../utils/errorClass");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const AuthService = require("../services/authService");
const { createClient } = require("redis");
const authService = require("../services/authService");
const redisClient = createClient();

// To further ensure that user will have only 1 sessions at time
redisClient
  .connect()
  .catch((e) => console.log("Could not connect to Redis", e));

/**
 * Controller for handling user authentication actions such as register, login, logout, etc.
 * @class AuthController
 */
class AuthController {
  /**
   * Registers a new user in the database without being verified.
   * On success, returns a 201 status with a success message and the username.
   *
   * @async
   * @param {Object} req - Express request object, containing user data (username, email, password).
   * @param {Object} res - Express response object, which will return the message "User registered successfully" and the username.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @returns {Promise<void>}
   */
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

  /**
   * Logs in the user and starts a session with user data such as id, username, and roles.
   * Ensures the user will only have one active session at a time, even in different browsers.
   * On success, returns a 200 status with a success message and user data
   * @async
   * @param {Object} req - Express request object containing user credentials (email, password)
   * @param {Object} res - Express response object, which will return a message "Login successful", username, roles, id, and profile picture URL.
   * @param {Function} next - Express next middleware function (typically error handler)
   * @returns {Promise<void>}
   */
  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;

      const { user, roles } = await AuthService.loginUser(email, password);

      // Check if a previous session exists and delete it if so
      const previousSessionId = await redisClient.get(`user:${user.id}`);
      if (previousSessionId) {
        await redisClient.del(`sess:${previousSessionId}`);
      }

      // Regenerate session for the re-logged-in user
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

        const url = await authService.getUsersProfilePic(req.session.user.id);

        return res.status(200).json({
          message: "Login successful",
          username: user.username,
          roles: roles,
          id: user.id,
          url: url,
        });
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Logs out the user by destroying their session and clearing cookies.
   * On success, returns a 200 status with a success message.
   * @async
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object, which will return the message "Logout successful".
   * @param {Function} next - Express next middleware function (typically error handler)
   * @throws {AppError} - Status 500 if logout fails and session cannot be destroyed.
   * @returns {Promise<void>}
   */
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

  /**
   * Sends a password reset email to the user with a unique token in the reset link.
   * On success, returns a 200 status with a success message.
   * @async
   * @param {Object} req - Express request object containing user's email
   * @param {Object} res - Express response object, which will return the message "Password email sent!".
   * @param {Function} next - Express next middleware function (typically error handler)
   * @returns {Promise<void>}
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await AuthService.passwordMail(email);
      return res.status(200).json({ message: "Password email sent!" });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Resets the user's password using the provided valid token and new password.
   * On success, returns a 200 status with a success message.
   *
   * @async
   * @param {Object} req - Express request object containing reset token and new password
   * @param {Object} res - Express response object, which will return the message "Password updated!".
   * @param {Function} next - Express next middleware function (typically error handler)
   * @returns {Promise<void>}
   */
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

  /**
   * Verifies the user's email by validating the provided token.
   * On success, it redirects the user to the frontend URL.
   *
   * @async
   * @param {Object} req - Express request object containing the verification token
   * @param {Object} res - Express response object, which will redirect to the frontend URL.
   * @param {Function} next - Express next middleware function (typically error handler)
   * @returns {Promise<void>}
   */
  async verifyEmail(req, res, next) {
    try {
      const token = req.params.token;
      await AuthService.verifyEmail(token);
      return res.redirect(process.env.FRONTEND_URL);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Checks the current authentication status of the user.
   * If the user is logged in, returns the user information (username, roles, id, and profile picture URL).
   * If the user is not authenticated, returns a response indicating the user is not authenticated.
   * @async
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object, which will return:
   *   - If authenticated: user data including isAuthenticated, username, id, roles, and profile picture URL.
   *   - If not authenticated: isAuthenticated set to false and other fields set to null.
   * @param {Function} next - Express next middleware function (typically error handler)
   * @returns {Promise<void>}
   */
  async checkStatus(req, res, next) {
    try {
      if (req.session.user) {
        const url = await authService.getUsersProfilePic(req.session.user.id);
        res.json({
          isAuthenticated: true,
          roles: req.session.user.roles,
          username: req.session.user.username,
          id: req.session.user.id,
          url: url,
        });
      } else {
        res.json({
          isAuthenticated: false,
          roles: [],
          username: null,
          id: null,
          url: null,
        });
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
