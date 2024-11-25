const mainOrganizationService = require("../services/mainOrganizationService");
const AppError = require("../utils/errorClass");

class MainOrganizationController {
  async getMainOrganizationList(req, res, next) {
    try {
      const organizations =
        await mainOrganizationService.getMainOrganizationList();
      res.status(200).json({
        organizations,
      });
    } catch (err) {
      next(err);
    }
  }

  async addMainOrganization(req, res, next) {
    try {
      const { name } = req.body;

      if (!name) {
        throw new AppError("Name is a required field.", 400);
      }
      const newOrganization = await mainOrganizationService.addMainOrganization(
        name
      );

      res.status(201).json({
        organization: newOrganization,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MainOrganizationController();
