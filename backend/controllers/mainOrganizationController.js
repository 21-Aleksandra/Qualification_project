const mainOrganizationService = require("../services/mainOrganizationService");
const AppError = require("../utils/errorClass");

class MainOrganizationController {
  async getMainOrganizationList(req, res, next) {
    try {
      const { userId, userRoles } = req.query;
      const organizations =
        await mainOrganizationService.getMainOrganizationList(
          userId,
          userRoles
        );
      res.status(200).json({
        organizations,
      });
    } catch (err) {
      console.log(err);
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
        message: "Main organization added successfully",
        organization: newOrganization,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MainOrganizationController();
