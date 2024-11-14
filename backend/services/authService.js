const AppError = require("../utils/errorClass");
const { User, UserRole } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Roles = require("../enums/roles");
const EmailService = require("./emailService");
const Filter = require("bad-words");
const {
  EMAIL_REGEX,
  USERNAME_REGEX,
  PASSWORD_REGEX,
} = require("../utils/regexConsts");
const filter = new Filter();

class AuthService {
  async registerUser(username, email, password) {
    if (!username || !email || !password) {
      throw AppError.badRequest("Username, email, and password are required");
    }

    if (!USERNAME_REGEX.test(username)) {
      throw AppError.badRequest(
        "Username must be 3-255 characters long and can only contain English letters, numbers, or underscores."
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      throw AppError.badRequest("Invalid email format");
    }

    if (!PASSWORD_REGEX.test(password)) {
      throw AppError.badRequest(
        "Password must be 8-80 characters, include at least one uppercase letter, one lowercase letter, one digit, and one special character (! . - _)."
      );
    }

    if (filter.isProfane(username)) {
      throw AppError.badRequest("Username contains inappropriate language");
    }

    const existingUserByEmail = await this.checkUserExistanceByEmail(email);
    if (existingUserByEmail) {
      throw AppError.badRequest("User with this email already exists.");
    }

    const existingUserByUsername = await this.checkUserExistanceByUsername(
      username
    );
    if (existingUserByUsername) {
      throw AppError.badRequest("User with this username already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: passwordHash,
    });

    await UserRole.create({
      userId: newUser.id,
      roleId: Roles.REGULAR,
    });

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    const verificationLink = `${process.env.BACKEND_URL}auth/verify-email/${token}`;
    await EmailService.SendMail(email, "verification", verificationLink);

    return newUser;
  }

  async loginUser(email, password) {
    if (!email || !password) {
      throw AppError.badRequest("Email, and password are required");
    }

    const existingUser = await this.checkUserExistanceByEmail(email);
    if (!existingUser) {
      throw AppError.badRequest("User with this email does not exist.");
    }

    if (existingUser.isVerified == false) {
      throw AppError.badRequest("You must verify your email");
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      throw AppError.badRequest("Invalid data");
    }

    const roles = await UserRole.findAll({
      where: { userId: existingUser.id },
      attributes: ["roleId"],
    });

    const roleIds = roles.map((role) => role.roleId);

    return { user: existingUser, roles: roleIds };
  }

  async verifyEmail(tokenFromLink) {
    await this.checkExpirationForToken(tokenFromLink);
    const decoded = jwt.verify(tokenFromLink, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await this.checkUserExistanceById(userId);

    if (!user) {
      throw AppError.badRequest("User not found");
    }

    if (user.isVerified) {
      throw AppError.badRequest("User is already activated");
    }

    await User.update({ isVerified: true }, { where: { id: userId } });
  }

  async passwordMail(email) {
    const newUser = await this.checkUserExistanceByEmail(email);
    if (!newUser) {
      throw AppError.badRequest("No user with such email");
    }
    if (!newUser.isVerified) {
      throw AppError.badRequest("Verify your email first!");
    }
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const passwordLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await EmailService.SendMail(email, "passwordReset", passwordLink);
  }

  async resetPassword(token, newPassword) {
    await this.checkExpirationForToken(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await this.checkUserExistanceById(userId);
    if (!user) {
      throw AppError.badRequest("User not found");
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      throw AppError.badRequest(
        "Password must be 8-80 characters, include at least one uppercase letter, one lowercase letter, one digit, and one special character (! . - _)."
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await User.update({ password: passwordHash }, { where: { id: userId } });
  }

  async checkUserExistanceByEmail(email) {
    return User.findOne({ where: { email } });
  }

  async checkUserExistanceById(id) {
    return User.findOne({ where: { id } });
  }

  async checkUserExistanceByUsername(username) {
    return await User.findOne({ where: { username } });
  }

  async checkExpirationForToken(token) {
    const decoded = jwt.decode(token, { complete: true });
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.payload.exp < currentTime) {
      throw AppError.badRequest("Expired link!");
    }
  }
}

module.exports = new AuthService();
