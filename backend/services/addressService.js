const {
  Address,
  Subsidiary,
  User,
  Subsidiary_Manager,
  Event,
} = require("../models");
const { Op } = require("sequelize");
const AppError = require("../utils/errorClass");
const Roles = require("../enums/roles");
class AddressService {
  async findSubsidiaryAddresses(userId, userRoles) {
    if (userId && userRoles && userRoles.includes(Roles.MANAGER)) {
      return await Address.findAll({
        attributes: [
          "id",
          "country",
          "city",
          "street",
          "lat",
          "lng",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: Subsidiary,
            required: true,
            include: [
              {
                model: User,
                where: { id: userId },
                attributes: [],
              },
            ],
            attributes: [],
          },
        ],
        order: [
          ["country", "ASC"],
          ["city", "ASC"],
          ["street", "ASC"],
        ],
      });
    }

    return await Address.findAll({
      attributes: [
        "id",
        "country",
        "city",
        "street",
        "lat",
        "lng",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Subsidiary,
          required: true,
          attributes: [],
        },
      ],
      order: [
        ["country", "ASC"],
        ["city", "ASC"],
        ["street", "ASC"],
      ],
    });
  }

  async findEventAddresses(userId, userRoles) {
    if (userId && userRoles && userRoles.includes(Roles.MANAGER)) {
      return await Address.findAll({
        attributes: [
          "id",
          "country",
          "city",
          "street",
          "lat",
          "lng",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: Event,
            required: true,
            include: [
              {
                model: User,
                as: "Author",
                where: { id: userId },
                attributes: [],
              },
            ],
            attributes: [],
          },
        ],
        order: [
          ["country", "ASC"],
          ["city", "ASC"],
          ["street", "ASC"],
        ],
      });
    }

    return await Address.findAll({
      attributes: [
        "id",
        "country",
        "city",
        "street",
        "lat",
        "lng",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Event,
          required: true,
          attributes: [],
        },
      ],
      order: [
        ["country", "ASC"],
        ["city", "ASC"],
        ["street", "ASC"],
      ],
    });
  }

  async getAllAddresses() {
    return await Address.findAll({
      attributes: [
        "id",
        "country",
        "city",
        "street",
        "lat",
        "lng",
        "createdAt",
        "updatedAt",
      ],
      order: [
        ["country", "ASC"],
        ["city", "ASC"],
        ["street", "ASC"],
      ],
    });
  }

  async createAddress(country, city, street, lat, lng) {
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

    const newAddress = await Address.create({
      country,
      city,
      street,
      lat,
      lng,
    });
    return newAddress;
  }

  async getOneAddress(id) {
    return await Address.findByPk(id);
  }

  async editAddress(id, updateData) {
    const existingAddress = await Address.findByPk(id);
    if (!existingAddress) {
      return null;
    }

    const changedFields = {};
    for (const key in updateData) {
      if (
        updateData[key] !== undefined &&
        updateData[key] !== existingAddress[key]
      ) {
        changedFields[key] = updateData[key];
      }
    }

    if (Object.keys(changedFields).length === 0) {
      return existingAddress; // Nothing changed
    }

    await existingAddress.update(changedFields);
    return existingAddress;
  }
}

module.exports = new AddressService();
