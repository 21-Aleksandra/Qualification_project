const { User, User_Role, Role } = require("../models");
const bcrypt = require("bcrypt");
const Filter = require("bad-words");
const AppError = require("../utils/errorClass");
const {
  EMAIL_REGEX,
  USERNAME_REGEX,
  PASSWORD_REGEX,
} = require("../utils/regexConsts");
const { Op } = require("sequelize");
const filter = new Filter();
const authService = require("./authService");

class UserService {
  async getAllUsers(filters = {}) {
    const whereConditions = {};

    if (filters.id) {
      whereConditions.id = filters.id;
    }

    if (filters.username) {
      whereConditions.username = {
        [Op.like]: `%${filters.username}%`,
      };
    }

    return await User.findAll({
      where: whereConditions,
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Role,
          attributes: ["id", "rolename"],
          through: { attributes: [] },
        },
      ],
    });
  }

  async getUserById(id) {
    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          attributes: ["id", "rolename"],
          through: { attributes: [] },
        },
      ],
    });

    if (!user) return null;

    const maskedPassword = "*".repeat(user.password.length);
    return {
      ...user.toJSON(),
      password: maskedPassword,
    };
  }

  async addUser({ username, password, email, roles, isVerified }) {
    if (!USERNAME_REGEX.test(username)) {
      throw new AppError(
        "Username must be 3-255 characters long and can only contain English letters, numbers, or underscores.",
        400
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      throw new AppError("Invalid email format", 400);
    }

    if (!PASSWORD_REGEX.test(password)) {
      throw new AppError(
        "Password must be 8-80 characters, include at least one uppercase letter, one lowercase letter, one digit, and one special character (! . - _).",
        400
      );
    }

    if (filter.isProfane(username)) {
      throw new AppError("Username contains inappropriate language", 400);
    }

    const existingUserByEmail = await authService.checkUserExistanceByEmail(
      email
    );
    if (existingUserByEmail) {
      throw AppError.badRequest("User with this email already exists.");
    }

    const existingUserByUsername =
      await authService.checkUserExistanceByUsername(username);
    if (existingUserByUsername) {
      throw AppError.badRequest("User with this username already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      isVerified: isVerified || false,
    });

    if (roles && roles.length) {
      for (const roleId of roles) {
        await User_Role.create({ userId: user.id, roleId });
      }
    }

    return await this.getUserById(user.id);
  }

  async editUser(id, { username, email, password, roles, isVerified }) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (username && !USERNAME_REGEX.test(username)) {
      throw new AppError(
        "Username must be 3-255 characters long and can only contain English letters, numbers, or underscores.",
        400
      );
    }

    if (email && !EMAIL_REGEX.test(email)) {
      throw new AppError("Invalid email format", 400);
    }

    if (password && !PASSWORD_REGEX.test(password)) {
      throw new AppError(
        "Password must be 8-80 characters, include at least one uppercase letter, one lowercase letter, one digit, and one special character (! . - _).",
        400
      );
    }

    if (username && filter.isProfane(username)) {
      throw new AppError("Username contains inappropriate language", 400);
    }

    if (email && email !== user.email) {
      const existingUserByEmail = await authService.checkUserExistanceByEmail(
        email
      );
      if (existingUserByEmail) {
        throw AppError.badRequest(
          "Another user with this email already exists."
        );
      }
    }

    if (username && username !== user.username) {
      const existingUserByUsername =
        await authService.checkUserExistanceByUsername(username);
      if (existingUserByUsername) {
        throw AppError.badRequest(
          "Another user with this username already exists."
        );
      }
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (isVerified !== undefined) user.isVerified = isVerified;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    if (roles) {
      const existingRoleIds = await User_Role.findAll({
        where: { userId: id },
        attributes: ["roleId"],
      }).then((rows) => rows.map((row) => row.roleId));

      const rolesAsNumbers = roles.map(Number);

      const newRoles = rolesAsNumbers.filter(
        (roleId) => !existingRoleIds.includes(roleId)
      );

      const removedRoleIds = existingRoleIds.filter(
        (roleId) => !rolesAsNumbers.includes(roleId)
      );

      for (const roleId of newRoles) {
        await User_Role.findOrCreate({ where: { userId: id, roleId } });
      }

      if (removedRoleIds.length) {
        await User_Role.destroy({
          where: { userId: id, roleId: { [Op.in]: removedRoleIds } },
        });
      }
    }

    return await this.getUserById(id);
  }

  async deleteUsers(ids) {
    const deletedCount = await User.destroy({
      where: { id: { [Op.in]: ids } },
    });

    return deletedCount;
  }
}

module.exports = new UserService();
