const AppError = require("../utils/errorClass");
const { User, User_Role, Photo } = require("../models");
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

/**
 * Service for handling user authentication-related actions like registration, login, password reset, etc.
 * @class AuthService
 */
class AuthService {
  /**
   * Registers a new user by validating input fields, checking if the user already exists,
   * hashing the password, creating the user, assigning roles, and sending a verification email.
   * @async
   * @param {string} username - The username of the user.
   * @param {string} email - The email address of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<Object>} - The newly created user.
   * @throws {AppError} - If any validation fails or user already exists.
   */
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

    await User_Role.create({
      userId: newUser.id,
      roleId: Roles.REGULAR,
    });

    //generates jwt token to ensure secure and validatable link
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    const verificationLink = `${process.env.BACKEND_URL}auth/verify-email/${token}`;
    await EmailService.SendMail(email, "verification", verificationLink);

    return newUser;
  }

  /**
   * Logs in a user by validating credentials (email, password) and returning roles if successful.
   * @async
   * @param {string} email - The email address of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<Object>} - The authenticated user and their roles.
   * @throws {AppError} - If any validation fails or user does not exist.
   */
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

    const roles = await User_Role.findAll({
      where: { userId: existingUser.id },
      attributes: ["roleId"],
    });

    const roleIds = roles.map((role) => role.roleId);

    return { user: existingUser, roles: roleIds };
  }

  /**
   * Verifies the user's email using the token sent via email.
   * @async
   * @param {string} tokenFromLink - The token received from the verification link.
   * @returns {Promise<void>} - Marks the user as verified if the token is valid.
   * @throws {AppError} - If the token is expired or user cannot be found.
   */
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

  /**
   * Sends a password reset email to the user.
   * @async
   * @param {string} email - The email address of the user.
   * @throws {AppError} - If no user exists with the given email or if the email is unverified.
   */
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

  /**
   * Resets the password of the user using the provided token.
   * @async
   * @param {string} token - The token used to verify the password reset request.
   * @param {string} newPassword - The new password.
   * @throws {AppError} - If the token is expired, user not found, or password is invalid.
   */
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

  /**
   * Checks if a user exists by email.
   * @async
   * @param {string} email - The email of the user.
   * @returns {Promise<Object|null>} - The user if found, otherwise null.
   */
  async checkUserExistanceByEmail(email) {
    return User.findOne({ where: { email } });
  }

  /**
   * Checks if a user exists by their ID.
   * @async
   * @param {string} id - The ID of the user.
   * @returns {Promise<Object|null>} - The user if found, otherwise null.
   */
  async checkUserExistanceById(id) {
    return User.findOne({ where: { id } });
  }

  /**
   * Checks if a user exists by username.
   * @async
   * @param {string} username - The username of the user.
   * @returns {Promise<Object|null>} - The user if found, otherwise null.
   */
  async checkUserExistanceByUsername(username) {
    return await User.findOne({ where: { username } });
  }

  /**
   * Checks if a token has expired by decoding and comparing the expiration time.
   * @async
   * @param {string} token - The token to check.
   * @throws {AppError} - If the token has expired.
   */
  async checkExpirationForToken(token) {
    const decoded = jwt.decode(token, { complete: true });
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.payload.exp < currentTime) {
      throw AppError.badRequest("Expired link!");
    }
  }

  /**
   * Retrieves the profile picture URL for a user.
   * @async
   * @param {string} userId - The ID of the user.
   * @returns {Promise<string|null>} - The URL of the user's profile picture, or null if not set.
   * @throws {Error} - If the user is not found.
   */
  async getUsersProfilePic(userId) {
    const user = await User.findOne({
      where: { id: userId },
      attributes: ["photoId"],
    });

    if (!user) {
      throw new Error("User not found.");
    }

    if (user.photoId == null) {
      return null;
    }

    const photo = await Photo.findOne({
      where: { id: user.photoId },
      attributes: ["url"],
    });

    return photo.url;
  }
}

module.exports = new AuthService();
