const AppError = require("../utils/errorClass");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const EmailService = require("../services/email-service");

class AuthService {
  async registerUser(username, email, password) {
    if (!username || !email || !password) {
      throw AppError.badRequest("Username, email, and password are required");
    }

    const existingUser = await this.checkUserExistanceByEmail(email);
    if (existingUser) {
      throw AppError.badRequest("User with this email does exist.");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: passwordHash,
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
    return existingUser;
  }

  async verifyEmail(tokenFromLink) {
    await this.checkExpirationForToken(token);
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
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const passwordLink = `${process.env.BACKEND_URL}auth/reset-password/${token}`;

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

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await User.update({ password: passwordHash }, { where: { id: userId } });
  }

  async checkUserExistanceByEmail(email) {
    const existingUser = await User.findOne({ where: { email: email } });
    return existingUser;
  }

  async checkUserExistanceById(id) {
    const existingUser = await User.findOne({ where: { id: id } });
    return existingUser;
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
