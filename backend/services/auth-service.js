const AppError = require("../utils/errorClass");
const { User } = require("../models");
const bcrypt = require("bcrypt");

class AuthService {
  async registerUser(username, email, password) {
    if (!username || !email || !password) {
      throw AppError.badRequest("Username, email, and password are required");
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      throw AppError.badRequest("User with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: passwordHash,
    });

    return newUser;
  }

  async loginUser(email, password) {
    if (!email || !password) {
      throw AppError.badRequest("Email, and password are required");
    }

    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
      throw AppError.badRequest("Invalid data");
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
}

module.exports = new AuthService();
