const userService = require("../services/userService");
const AppError = require("../utils/errorClass");
const { createClient } = require("redis");
const redisClient = createClient();
const authService = require("../services/authService");

redisClient
  .connect()
  .catch((e) => console.log("Could not connect to Redis", e));

/**
 * Controller for handling news-related actions such as retrieving, adding, editing, and deleting users
 * @class UserController
 */
class UserController {
  /**
   * Retrieves a list of all users, optionally filtered by user ID and username.
   * Sends a status 200 response with the list of users.
   *
   * @async
   * @param {Object} req - Express request object, containing optional filters in the query.
   * @param {Object} res - Express response object used to return the list of users.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @returns {Promise<void>}
   */
  async getAllUsers(req, res, next) {
    try {
      const { id, username } = req.query;
      const users = await userService.getAllUsers({ id, username });
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves a single user by their ID.
   * Sends a status 200 response with the user details.
   *
   * @async
   * @param {Object} req - Express request object, containing the user ID in the URL parameters.
   * @param {Object} res - Express response object used to return the user details.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if the user ID is missing.
   * @throws {AppError} - Status 404 if the user with the given ID is not found.
   * @returns {Promise<void>}
   */
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError("User ID is required", 400);
      }

      const user = await userService.getUserById(id);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Adds a new user to the system.
   * Sends a status 201 response with the newly created user details.
   *
   * @async
   * @param {Object} req - Express request object, containing the user data in the body.
   * @param {Object} res - Express response object used to return the newly created user data.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if any required field (username, password, email, roles) is missing.
   * @returns {Promise<void>}
   */
  async addUser(req, res, next) {
    try {
      const { username, password, email, roles, isVerified } = req.body;

      if (!username || !password || !email || !roles) {
        throw new AppError(
          "Username, password, email, roles are required",
          400
        );
      }

      const rolesArray = roles.split(",").map((role) => parseInt(role.trim()));

      const newUser = await userService.addUser({
        username,
        password,
        email,
        roles: rolesArray,
        isVerified,
      });

      res.status(201).json({
        message: "User added successfully",
        user: newUser,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Edits an existing user's details.
   * Updates the user and sends a status 200 response with the updated user details.
   * If the user is updated, the previous session is also deleted from Redis.
   *
   * @async
   * @param {Object} req - Express request object, containing the user ID in the URL parameters and the updated user data in the body.
   * @param {Object} res - Express response object used to return the updated user data.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if username, email, or roles are missing.
   * @returns {Promise<void>}
   */
  async editUser(req, res, next) {
    try {
      const { id } = req.params;
      const { username, email, password, roles, isVerified } = req.body;

      if (!username || !email || !roles) {
        throw new AppError("Username, email, roles are required", 400);
      }

      const rolesArray = roles.split(",").map((role) => parseInt(role.trim()));

      const updatedUser = await userService.editUser(id, {
        username,
        email,
        password,
        roles: rolesArray,
        isVerified,
      });

      const previousSessionId = await redisClient.get(`user:${updatedUser.id}`);
      if (previousSessionId) {
        await redisClient.del(`sess:${previousSessionId}`);
      }

      res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Deletes multiple users based on their IDs.
   * Deletes users and removes their session data from Redis.
   * Sends a status 200 response with the count of deleted users.
   *
   * @async
   * @param {Object} req - Express request object, containing the IDs of users to delete in the body.
   * @param {Object} res - Express response object used to return the result of the deletion operation.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if the `ids` parameter is invalid or missing.
   * @returns {Promise<void>}
   */
  async deleteUsers(req, res, next) {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        throw new AppError("An array of user IDs is required", 400);
      }

      const deletedCount = await userService.deleteUsers(ids);

      for (const id of ids) {
        const user = await userService.getUserById(id);
        if (user) {
          const previousSessionId = await redisClient.get(`user:${user.id}`);
          if (previousSessionId) {
            await redisClient.del(`sess:${previousSessionId}`);
          }
        }
      }

      res.status(200).json({
        deletedCount,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
