const mainOrganizationService = require("../services/mainOrganizationService");
const AppError = require("../utils/errorClass");

/**
 * Controller for handling main organization actions such as retrieving, adding, editing, and fetching details of organizations.
 * @class MainOrganizationController
 */
class MainOrganizationController {
  /**
   * Retrieves a list of main organizations, potentially filtered by user ID and roles.
   * If the user has a manager role, they will receive only the types of their authored subsidiaries.
   * Sends a 200 status with the list of organizations.
   *
   * @async
   * @param {Object} req - Express request object, containing optional `userId` and `userRoles` in the query string.
   * @param {Object} res - Express response object, containing the list of organizations.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @returns {Promise<void>}
   */
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

  /**
   * Adds a new main organization.
   * Validates that the organization name is provided in the request body and then creates the new organization.
   * Sends a 201 status with the success message and newly created organization.
   *
   * @async
   * @param {Object} req - Express request object, containing the organization name in the body.
   * @param {Object} res - Express response object, which returns the success message and the newly created organization.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if no name is provided.
   * @returns {Promise<void>}
   */
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

  /**
   * Edits an existing main organization.
   * Updates the data of an existing organization using the organization ID from the URL parameters and the update data from the request body.
   * Sends a 200 status with the updated organization.
   *
   * @async
   * @param {Object} req - Express request object, containing the organization ID in the URL parameters and update data in the body.
   * @param {Object} res - Express response object, which returns the updated organization data.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if no update data is provided.
   * @throws {AppError} - Status 404 if the organization is not found.
   * @returns {Promise<void>}
   */
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

  /**
   * Retrieves details of a single main organization by its ID.
   * Sends a 200 status with the details of the requested organization.
   *
   * @async
   * @param {Object} req - Express request object, containing the organization ID in the URL parameters.
   * @param {Object} res - Express response object, which returns the details of the requested organization.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 404 if the organization is not found.
   * @returns {Promise<void>}
   */
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
