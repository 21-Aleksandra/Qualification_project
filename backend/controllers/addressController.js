const AppError = require("../utils/errorClass");
const addressService = require("../services/addressService");

/**
 * Controller for handling address-related actions.
 * @class AddressController
 */
class AddressController {
  /**
   * Retrieves the list of subsidiary addresses based on user roles and userId.
   * If the user is a manager, only their subsidiary addresses are retrieved;
   * otherwise, the full list of subsidiary addresses is returned.
   * Sends a 200 status with the address list if the request is successful.
   *
   * @async
   * @param {Object} req - Express request object, containing the user ID and roles as query parameters.
   * @param {Object} res - Express response object, which returns a list of subsidiary addresses.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @returns {Promise<void>}
   */
  async getSubsidiaryAddressList(req, res, next) {
    try {
      const { userId, userRoles } = req.query;
      const rolesArray = userRoles
        ? userRoles.split(",").map((role) => Number(role))
        : [];
      const addresses = await addressService.findSubsidiaryAddresses(
        userId,
        rolesArray
      );

      res.status(200).json(addresses);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves the list of event addresses based on user roles and userId.
   * If the user is a manager, only their authored event addresses are retrieved;
   * otherwise, the full list of event addresses is returned.
   * Sends a 200 status with the event address list if the request is successful.
   *
   * @async
   * @param {Object} req - Express request object, containing the user ID and roles as query parameters.
   * @param {Object} res - Express response object, which returns a list of event addresses.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @returns {Promise<void>}
   */
  async getEventAddressList(req, res, next) {
    try {
      const { userId, userRoles } = req.query;
      const rolesArray = userRoles
        ? userRoles.split(",").map((role) => Number(role))
        : [];
      const addresses = await addressService.findEventAddresses(
        userId,
        rolesArray
      );

      res.status(200).json(addresses);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves the full list of addresses in the database.
   * Sends a 200 status with the full list of addresses if the request is successful.
   *
   * @async
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object, which returns the full list of addresses.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @returns {Promise<void>}
   */
  async getAllAddressList(req, res, next) {
    try {
      const addresses = await addressService.getAllAddresses();
      res.status(200).json(addresses);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Allows clients to create a new address by specifying country, city, street,
   * latitude, and longitude. The newly added address is then returned in the response.
   * Sends a 201 status with a success message and the new address ID if the request is successful.
   *
   * @async
   * @param {Object} req - Express request object, containing the country, city, street, latitude, and longitude in the body.
   * @param {Object} res - Express response object, which returns a success message and the new address ID.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if country, city, or street are not provided.
   * @returns {Promise<void>}
   */
  async addAddress(req, res, next) {
    try {
      const { country, city, street, lat, lng } = req.body;

      if (!country || !city || !street) {
        throw new AppError(
          "Country, city, and street are required fields.",
          400
        );
      }

      const newAddress = await addressService.createAddress(
        country,
        city,
        street,
        lat,
        lng
      );

      res.status(201).json({
        message: "Address added successfully",
        addressId: newAddress,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Allows clients to fetch the details of a single address based on its ID.
   * Sends a 200 status with the address details if the request is successful.
   *
   * @async
   * @param {Object} req - Express request object, containing the address ID as a URL parameter.
   * @param {Object} res - Express response object, which returns the address details.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 404 if the address is not found.
   * @returns {Promise<void>}
   */
  async getOneAddress(req, res) {
    try {
      const { id } = req.params;
      const address = await addressService.getOneAddress(id);
      if (!address) {
        throw new AppError("Address not found", 404);
      }
      return res.status(200).json(address);
    } catch (error) {
      next(err);
    }
  }

  /**
   * Allows clients to update an address based on its ID.
   * Sends a 200 status with the updated address details if the request is successful.
   *
   * @async
   * @param {Object} req - Express request object, containing the address ID as a URL parameter and the updated data in the body.
   * @param {Object} res - Express response object, which returns the updated address details.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 404 if the address is not found or no changes were made.
   * @returns {Promise<void>}
   */
  async editAddress(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedAddress = await addressService.editAddress(id, updateData);
      if (!updatedAddress) {
        throw new AppError("Address not found or no changes applied", 404);
      }
      return res.status(200).json(updatedAddress);
    } catch (error) {
      next(err);
    }
  }
}

module.exports = new AddressController();
