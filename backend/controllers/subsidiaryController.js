const subsidiaryService = require("../services/subsidiaryService");
const AppError = require("../utils/errorClass");

class SubsidiaryController {
  async getSubsidiaryFilteredList(req, res, next) {
    try {
      const filters = {
        name: req.query.name || "",
        cities: req.query.cities
          ? req.query.cities.split(",").map((city) => city.trim())
          : [],
        countries: req.query.countries
          ? req.query.countries.split(",").map((country) => country.trim())
          : [],
        missions: req.query.missions
          ? req.query.missions.split(",").map((mission) => mission.trim())
          : [],
        mainOrganizationIds: req.query.mainOrganizationIds
          ? req.query.mainOrganizationIds.split(",").map((id) => id.trim())
          : [],
        sortBy: req.query.sortBy || "createdAt",
        sortOrder: req.query.sortOrder || "desc",
        userId: req.query.userId,
        userRole: req.query.userRole,
      };

      const subsidiaries = await subsidiaryService.getSubsidiaryFilteredList(
        filters
      );

      res.status(200).json(subsidiaries);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getSubsidiaryById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.query.userId;
      const userRole = req.query.userRole;
      if (!id) {
        throw new AppError("Subsidiary ID is required", 400);
      }

      const subsidiary = await subsidiaryService.getSubsidiaryById(
        id,
        userId,
        userRole
      );

      res.status(200).json(subsidiary);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async addSubsidiary(req, res, next) {
    try {
      const {
        name,
        description,
        mainOrganizationId,
        foundedAt,
        addressId,
        email,
        website,
        staffCount,
        missions,
      } = req.body;

      const newSubsidiary = await subsidiaryService.addSubsidiary({
        name,
        description,
        mainOrganizationId,
        foundedAt,
        addressId,
        email,
        website,
        staffCount,
        missions,
      });

      res.status(201).json(newSubsidiary);
    } catch (err) {
      next(err);
    }
  }

  async editSubsidiary(req, res, next) {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        mainOrganizationId,
        foundedAt,
        addressId,
        email,
        website,
        staffCount,
        missions,
      } = req.body;

      if (!id) {
        throw new AppError("Subsidiary ID is required", 400);
      }

      const updatedSubsidiary = await subsidiaryService.editSubsidiary(id, {
        name,
        description,
        mainOrganizationId,
        foundedAt,
        addressId,
        email,
        website,
        staffCount,
        missions,
      });

      res.status(200).json(updatedSubsidiary);
    } catch (err) {
      next(err);
    }
  }

  async deleteSubsidiaries(req, res, next) {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new AppError("A valid array of subsidiary IDs is required", 400);
      }

      const result = await subsidiaryService.deleteSubsidiaries(ids);
      res
        .status(200)
        .json({ message: `Successfully deleted ${result} subsidiaries` });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SubsidiaryController();
