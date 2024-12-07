const AppError = require("../utils/errorClass");
const addressService = require("../services/addressService");

class AddressController {
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

  async getAllAddressList(req, res, next) {
    try {
      const addresses = await addressService.getAllAddresses();
      res.status(200).json(addresses);
    } catch (err) {
      next(err);
    }
  }

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
}

module.exports = new AddressController();
