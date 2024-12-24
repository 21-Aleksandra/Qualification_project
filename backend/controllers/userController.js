const userService = require("../services/userService");
const AppError = require("../utils/errorClass");
const { createClient } = require("redis");
const redisClient = createClient();
const authService = require("../services/authService");

redisClient
  .connect()
  .catch((e) => console.log("Could not connect to Redis", e));

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const { id, username } = req.query;
      const users = await userService.getAllUsers({ id, username });
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }

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
