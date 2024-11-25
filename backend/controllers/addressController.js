const AppError = require("../utils/errorClass");
const addressService = require("../services/addressService");

class AddressController {
  async getAddressList(req, res, next) {
    try {
      const { query } = req.query;

      const addresses = await addressService.findAddresses(query);

      res.status(200).json(addresses);
    } catch (err) {
      next(err);
    }
  }

  async addAddress(req, res, next) {
    try {
      const { country, city, street } = req.body;

      if (!country || !city || !street) {
        throw new AppError(
          "Country, city, and street are required fields.",
          400
        );
      }

      const newAddress = await addressService.createAddress(
        country,
        city,
        street
      );

      res.status(201).json({
        message: "Address added successfully",
        address: newAddress,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AddressController();
