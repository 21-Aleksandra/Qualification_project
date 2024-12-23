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
        userRoles: req.query.userRoles
          ? req.query.userRoles.split(",").map((role) => Number(role.trim()))
          : [],
      };

      const subsidiaries = await subsidiaryService.getSubsidiaryFilteredList(
        filters
      );

      res.status(200).json(subsidiaries);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  async getSubsidiaryById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.query.userId;
      const userRoles = req.query.userRoles;
      if (!id) {
        throw new AppError("Subsidiary ID is required", 400);
      }

      const subsidiary = await subsidiaryService.getSubsidiaryById(
        id,
        userId,
        userRoles
      );

      res.status(200).json(subsidiary);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getSubsidiaryNamesList(req, res, next) {
    try {
      const { userId, userRoles } = req.query;
      const rolesArray = userRoles
        ? userRoles.split(",").map((role) => Number(role))
        : [];
      const subsidiaries = await subsidiaryService.findSubsidiaryNames(
        userId,
        rolesArray
      );

      res.status(200).json(subsidiaries);
    } catch (err) {
      next(err);
    }
  }

  async addSubsidiary(req, res, next) {
    try {
      console.log(req.files);
      const {
        managerId,
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

      console.log(missions);

      if (!name || !managerId) {
        throw new AppError("ManagedId and name are required", 400);
      }

      console.log(req.files);

      const bannerPhoto = req.files.bannerPhoto
        ? req.files.bannerPhoto[0]
        : null;
      const otherPhotos = req.files.otherPhotos || [];

      const newSubsidiary = await subsidiaryService.addSubsidiary({
        managerId,
        name,
        description,
        mainOrganizationId,
        foundedAt,
        addressId,
        email,
        website,
        staffCount,
        missions,
        bannerPhoto,
        otherPhotos,
      });

      res.status(201).json(newSubsidiary);
    } catch (err) {
      console.log(err);
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

      const bannerPhoto = req.files.bannerPhoto
        ? req.files.bannerPhoto[0]
        : null;
      const otherPhotos = req.files.otherPhotos || [];

      if (!id) {
        throw new AppError("Subsidiary ID is required", 400);
      }

      if (!name || name == "") {
        throw new AppError("Name is required", 400);
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
        bannerPhoto,
        otherPhotos,
      });

      res.status(200).json(updatedSubsidiary);
    } catch (err) {
      console.log(err);
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

  async changeManagers(req, res, next) {
    try {
      const { id } = req.params;
      const { managerIds } = req.body;

      if (!managerIds || !Array.isArray(managerIds)) {
        throw new AppError(
          "Invalid or missing 'managerIds' parameter. Provide an array of IDs.",
          400
        );
      }

      const result = await subsidiaryService.updateManagers(id, managerIds);

      res.status(200).json({
        message: "Subsidiary managers updated successfully",
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SubsidiaryController();
