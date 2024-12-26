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

/**
 * Service for managing Address-related database operations.
 * Handles operations like finding, creating, and updating addresses.
 * @class AddressService
 */
class AddressService {
  /**
   * Finds all addresses associated with a subsidiary, optionally filtering based on user roles and user ID.
   * If the user is a manager, only returns addresses related to that specific user.
   * @async
   * @param {string} userId - ID of the user requesting the data.
   * @param {Array} userRoles - Array of roles associated with the user.
   * @returns {Promise<Array>} - List of addresses matching the filters.
   */
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
                where: { id: userId }, // Filters subsidiaries by the specific user.
                attributes: [], // Do not return any attributes from the Subsidiary model.
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
    // Default query if user is not a manager or user ID is not provided.
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
          attributes: [], // Do not return any attributes from the Subsidiary model.
        },
      ],
      order: [
        ["country", "ASC"],
        ["city", "ASC"],
        ["street", "ASC"],
      ],
    });
  }

  /**
   * Finds all addresses associated with an event, optionally filtering based on user roles and user ID.
   * If the user is a manager, only returns addresses related to that specific user's events.
   * @async
   * @param {string} userId - ID of the user requesting the data.
   * @param {Array} userRoles - Array of roles associated with the user.
   * @returns {Promise<Array>} - List of addresses matching the filters.
   */
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
                where: { id: userId }, // Filters events by the specific user.
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
    // Default query if user is not a manager or user ID is not provided.
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
          attributes: [], // Do not return any attributes from the Event model.
        },
      ],
      order: [
        ["country", "ASC"],
        ["city", "ASC"],
        ["street", "ASC"],
      ],
    });
  }

  /**
   * Retrieves all addresses from the database.
   * Returns all addresses ordered by country, city, and street.
   * @async
   * @returns {Promise<Array>} - List of all addresses.
   */
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

  /**
   * Creates a new address in the database.
   * Validates input length for country, city, and street fields, and checks if the address already exists.
   * Throws an error if any validation fails.
   * @async
   * @param {string} country - Country of the address.
   * @param {string} city - City of the address.
   * @param {string} street - Street of the address.
   * @param {number} lat - Latitude of the address.
   * @param {number} lng - Longitude of the address.
   * @throws {AppError} - If validation fails or address already exists.
   * @returns {Promise<Object>} - The newly created address.
   */
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

  /**
   * Retrieves a single address by its ID.
   * @async
   * @param {number} id - ID of the address to retrieve.
   * @returns {Promise<Object|null>} - The address with the given ID, or null if not found.
   */
  async getOneAddress(id) {
    return await Address.findByPk(id);
  }

  /**
   * Edits an existing address in the database.
   * Only updates fields that have changed, and returns the updated address.
   * If no changes are made, returns the original address.
   * @async
   * @param {number} id - ID of the address to update.
   * @param {Object} updateData - Object containing the fields to update.
   * @returns {Promise<Object|null>} - The updated address, or null if no address with the given ID was found.
   */
  async editAddress(id, updateData) {
    const existingAddress = await Address.findByPk(id);
    if (!existingAddress) {
      return null;
    }

    // Tracking the fields that have changed.
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
