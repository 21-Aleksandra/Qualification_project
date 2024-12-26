const { Main_Organization, Subsidiary, User } = require("../models");
const AppError = require("../utils/errorClass");
const Roles = require("../enums/roles");

/**
 * Service for managing main organizations .
 * Handles operations like fetching, creating, and updating main organizations.
 * @class MainOrganizationService
 */
class MainOrganizationService {
  /**
   * Retrieves a list of main organizations.
   * If the user has a manager role, only returns organizations related to that user.
   * @async
   * @param {string} userId - ID of the user requesting the organizations.
   * @param {Array} userRoles - Array of roles assigned to the user.
   * @returns {Promise<Array>} - List of main organizations.
   */
  async getMainOrganizationList(userId, userRoles) {
    let organizations;
    if (userRoles && userRoles.includes(Roles.MANAGER)) {
      organizations = await Main_Organization.findAll({
        include: [
          {
            model: Subsidiary,
            required: true,
            include: [
              {
                model: User,
                where: { id: userId }, // Filters subsidiaries for the specific user
                attributes: [],
              },
            ],
            attributes: [],
          },
        ],
        order: [["name", "ASC"]],
      });
    } else {
      organizations = await Main_Organization.findAll({
        order: [["name", "ASC"]],
      });
    }

    return organizations;
  }

  /**
   * Adds a new main organization by getting its name.
   * @async
   * @param {string} name - The name of the new organization.
   * @returns {Promise<Object>} - The created main organization.
   * @throws {AppError} - If the name is too long or the organization already exists.
   */
  async addMainOrganization(name) {
    const MAX_LENGTH = 255;

    if (name.length > MAX_LENGTH) {
      throw new AppError(
        "Organization name exceeds the maximum length of 255 characters.",
        400
      );
    }

    const existingOrganization = await Main_Organization.findOne({
      where: { name },
    });

    if (existingOrganization) {
      throw new AppError(
        "Main Organization with the same name already exists.",
        400
      );
    }

    const newOrganization = await Main_Organization.create({ name });
    return newOrganization;
  }

  /**
   * Edits an existing main organization.
   * Updates only the fields that have changed, and returns the updated organization.
   * @async
   * @param {string} id - ID of the organization to update.
   * @param {Object} updateData - Object containing the fields to be updated.
   * @returns {Promise<Object|null>} - The updated organization, or null if not found.
   */
  async editMainOrganization(id, updateData) {
    const existingOrganization = await Main_Organization.findByPk(id);
    if (!existingOrganization) {
      return null;
    }

    const changedFields = {};
    // Prepare an object to hold the changed fields
    for (const key in updateData) {
      if (
        updateData[key] !== undefined &&
        updateData[key] !== existingOrganization[key]
      ) {
        changedFields[key] = updateData[key];
      }
    }

    if (Object.keys(changedFields).length === 0) {
      return existingOrganization; // No changes applied, but return existing entry
    }

    await existingOrganization.update(changedFields);
    return existingOrganization;
  }

  /**
   * Retrieves a single main organization by its ID.
   * @async
   * @param {string} id - ID of the organization to retrieve.
   * @returns {Promise<Object|null>} - The main organization, or null if not found.
   */
  async getOneMainOrganization(id) {
    return await Main_Organization.findByPk(id);
  }
}

module.exports = new MainOrganizationService();
