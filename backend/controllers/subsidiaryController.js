const subsidiaryService = require("../services/subsidiaryService");
const AppError = require("../utils/errorClass");
/**
 * Controller for handling subsidiary-related actions such as retrieving, adding, editing, and deleting subsidiaries.
 * @class SubsidiaryController
 */
class SubsidiaryController {
  /**
   * Retrieves a filtered list of subsidiaries based on query parameters.
   * Processes filters like name, cities, countries, missions, and others,
   * and returns the matching subsidiaries.
   * If the user has a manager role, only the subsidiaries managed by that user are returned.
   * Sends a status 200 response with the filtered list of subsidiaries.
   *
   * @async
   * @param {Object} req - Express request object, containing the query parameters for filtering subsidiaries.
   * @param {Object} res - Express response object used to return the filtered list of subsidiaries.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @returns {Promise<void>}
   */
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
  /**
   * Retrieves a subsidiary by its ID.
   * Fetches detailed information for the subsidiary with the provided ID.
   * Optionally checks for user permissions using userId and userRoles.
   * Sends a status 200 response with the subsidiary details.
   *
   *
   * @async
   * @param {Object} req - Express request object, containing the subsidiary ID in the URL parameters and user info in the query.
   * @param {Object} res - Express response object used to return the requested subsidiary details.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if subsidiary ID is missing.
   * @returns {Promise<void>}
   */
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
      next(err);
    }
  }

  /**
   * Retrieves a list of subsidiary names.
   * Fetches all subsidiary names, potentially filtered by userId and userRoles.
   * If the user has a manager role, only the subsidiaries managed by that user will be returned.
   * Sends a status 200 response with the list of subsidiary names.
   *
   * @async
   * @param {Object} req - Express request object, containing user info in the query.
   * @param {Object} res - Express response object used to return the list of subsidiary names.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @returns {Promise<void>}
   */
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

  /**
   * Adds a new subsidiary.
   * Processes the details of the new subsidiary, including manager, name, description, and other relevant data.
   * It also handles file uploads such as banner and other photos for the subsidiary.
   * Sends a status 201 response with the newly created subsidiary data.
   *
   * @async
   * @param {Object} req - Express request object, containing the subsidiary data in the body and files.
   * @param {Object} res - Express response object used to return the newly created subsidiary data.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if required fields like `name` or `managerId` are missing.
   * @returns {Promise<void>}
   */
  async addSubsidiary(req, res, next) {
    try {
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

      if (!name || !managerId) {
        throw new AppError("ManagedId and name are required", 400);
      }

      let bannerPhoto = null;
      let otherPhotos = [];

      // Ensure req.files is defined before accessing it
      if (req.files) {
        if (req.files.bannerPhoto) {
          bannerPhoto = req.files.bannerPhoto[0]; // First file for 'bannerPhoto'
        }
        if (req.files.otherPhotos) {
          otherPhotos = req.files.otherPhotos; // Array of 'otherPhotos'
        }
      }
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
      next(err);
    }
  }

  /**
   * Edits an existing subsidiary.
   * Updates an existing subsidiary's details, including name, description, contact info, and photos.
   * Sends a status 200 response with the updated subsidiary data.
   *
   * @async
   * @param {Object} req - Express request object, containing the subsidiary ID in the URL parameters and updated data in the body.
   * @param {Object} res - Express response object used to return the updated subsidiary data.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if subsidiary ID or name is missing or invalid.
   * @returns {Promise<void>}
   */
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

      let bannerPhoto = null;
      let otherPhotos = [];

      // Ensure req.files is defined before accessing it
      if (req.files) {
        if (req.files.bannerPhoto) {
          bannerPhoto = req.files.bannerPhoto[0]; // First file for 'bannerPhoto'
        }
        if (req.files.otherPhotos) {
          otherPhotos = req.files.otherPhotos; // Array of 'otherPhotos'
        }
      }
      if (!id) {
        throw new AppError("Subsidiary ID is required", 400);
      }

      if (!name || name == "") {
        throw new AppError("Name is required", 400);
      }

      let userId = req.session.user.id;

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
        userId,
      });

      res.status(200).json(updatedSubsidiary);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Deletes multiple subsidiaries based on provided IDs.
   * This method deletes the subsidiaries whose IDs are passed in the request body.
   *
   * @async
   * @param {Object} req - Express request object, containing the IDs of subsidiaries to delete in the body.
   * @param {Object} res - Express response object, which returns the result of the deletion operation.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if a valid array of subsidiary IDs is not provided.
   * @returns {Promise<void>}
   */
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

  /**
   * Changes the managers for a subsidiary based on the provided manager IDs.
   * Updates the subsidiary with new managers whose IDs are passed in the request body.
   * Sends a status 200 response with a message indicating the update was successful.
   *
   * @async
   * @param {Object} req - Express request object, containing the subsidiary ID in the URL parameters and the manager IDs in the body.
   * @param {Object} res - Express response object used to return the result of the update operation.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if the `managerIds` parameter is invalid or missing.
   * @returns {Promise<void>}
   */
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
