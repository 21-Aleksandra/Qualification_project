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

  async editMainOrganization(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!updateData || Object.keys(updateData).length === 0) {
        throw new AppError("No data provided for update", 400);
      }

      const updatedOrganization =
        await mainOrganizationService.editMainOrganization(id, updateData);
      if (!updatedOrganization) {
        throw new AppError("Main organization not found", 404);
      }

      res.status(200).json(updatedOrganization);
    } catch (err) {
      next(err);
    }
  }

  async getOneMainOrganization(req, res, next) {
    try {
      const { id } = req.params;

      const organization = await mainOrganizationService.getOneMainOrganization(
        id
      );
      if (!organization) {
        throw new AppError("Main organization not found", 404);
      }

      res.status(200).json(organization);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MainOrganizationController();
