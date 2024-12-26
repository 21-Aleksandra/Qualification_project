const { Mission } = require("../models");
const AppError = require("../utils/errorClass");
const { MISSION_NAME_REGEX } = require("../utils/regexConsts");

/**
 * Service for managing missions.
 * Provides operations like fetching, creating, and updating mission entries.
 * @class MissionService
 */
class MissionService {
  /**
   * Retrieves the list of all missions ordered alphabetically by name.
   * @async
   * @returns {Promise<Array>} - List of missions.
   */
  async getMissionList() {
    const missions = await Mission.findAll({
      order: [["name", "ASC"]],
    });
    return missions;
  }

  /**
   * Adds a new mission to the database.
   * Validates the mission name against a predefined regular expression.
   * @async
   * @param {string} name - The name of the new mission.
   * @returns {Promise<Object>} - The newly created mission.
   * @throws {AppError} - If the name is invalid or the mission already exists.
   */
  async addMission(name) {
    if (!MISSION_NAME_REGEX.test(name)) {
      throw new AppError(
        "Mission name must be 3-100 characters long and can only include English letters, numbers, commas, dots, and spaces.",
        400
      );
    }

    const existingMission = await Mission.findOne({
      where: { name },
    });

    if (existingMission) {
      throw new AppError("Mission with the same name already exists.", 400);
    }

    const newMission = await Mission.create({ name });
    return newMission;
  }

  /**
   * Updates an existing mission's details.
   * Only applies changes if the provided fields are different from the existing ones.
   * @async
   * @param {string} id - ID of the mission to update.
   * @param {Object} updateData - Object containing the fields to update.
   * @returns {Promise<Object|null>} - The updated mission, or null if not found.
   */
  async editMission(id, updateData) {
    const existingMission = await Mission.findByPk(id);
    if (!existingMission) {
      return null; // Return null if the mission doesn't exist
    }

    // Prepare an object to hold the changed fields
    const changedFields = {};
    for (const key in updateData) {
      if (
        updateData[key] !== undefined &&
        updateData[key] !== existingMission[key]
      ) {
        changedFields[key] = updateData[key]; // Add only changed fields to the object
      }
    }

    if (Object.keys(changedFields).length === 0) {
      return existingMission; // No changes applied, but return existing entry
    }

    await existingMission.update(changedFields);
    return existingMission;
  }

  async getOneMission(id) {
    return await Mission.findByPk(id);
  }
}

module.exports = new MissionService();
