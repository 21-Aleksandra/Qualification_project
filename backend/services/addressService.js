const { Address } = require("../models");
const { Op } = require("sequelize");
const AppError = require("../utils/errorClass");

class AddressService {
  async findAddresses() {
    return await Address.findAll({
      order: [
        ["country", "ASC"],
        ["city", "ASC"],
        ["street", "ASC"],
      ],
    });
  }

  async createAddress(country, city, street) {
    const MAX_LENGTH = 255;

    if (country.length > MAX_LENGTH) {
      throw new AppError(
        "Country exceeds the maximum length of 255 characters.",
        400
      );
    }
    if (city.length > MAX_LENGTH) {
      throw new AppError(
        "City exceeds the maximum length of 255 characters.",
        400
      );
    }
    if (street.length > MAX_LENGTH) {
      throw new AppError(
        "Street exceeds the maximum length of 255 characters.",
        400
      );
    }

    const existingAddress = await Address.findOne({
      where: {
        country,
        city,
        street,
      },
    });

    if (existingAddress) {
      throw new AppError(
        "Address with the same country, city, and street already exists.",
        400
      );
    }

    const newAddress = await Address.create({ country, city, street });
    return newAddress;
  }
}

module.exports = new AddressService();
