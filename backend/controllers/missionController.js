const missionService = require("../services/missionService");
const AppError = require("../utils/errorClass");

/**
 * Controller for handling mission-related actions such as retrieving, adding, editing, and fetching details of missions.
 * @class MissionController
 */
class MissionController {
  /**
   * Retrieves a list of all missions.
   * Sends a 200 status with the list of missions.
   *
   * @async
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object, containing the list of missions.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @returns {Promise<void>}
   */
  async getMissionList(req, res, next) {
    try {
      const missions = await missionService.getMissionList();
      res.status(200).json({
        missions,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Adds a new mission.
   * Validates that the mission name is provided in the request body and then creates the new mission.
   * Sends a 201 status with the success message and newly created mission.
   *
   * @async
   * @param {Object} req - Express request object, containing the mission name in the body.
   * @param {Object} res - Express response object, which returns the success message and the newly created mission.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if no name is provided.
   * @returns {Promise<void>}
   */
  async addMission(req, res, next) {
    try {
      const { name } = req.body;

      if (!name) {
        throw new AppError("Mission name is a required field.", 400);
      }

      const newMission = await missionService.addMission(name);
      res.status(201).json({
        message: "Mission added successfully",
        mission: newMission,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Edits an existing mission.
   * Updates the data of an existing mission using the mission ID from the URL parameters and the update data from the request body.
   * Sends a 200 status with the updated mission.
   *
   * @async
   * @param {Object} req - Express request object, containing the mission ID in the URL parameters and update data in the body.
   * @param {Object} res - Express response object, which returns the updated mission data.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 400 if no update data is provided.
   * @throws {AppError} - Status 404 if the mission is not found.
   * @returns {Promise<void>}
   */
  async editMission(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!updateData || Object.keys(updateData).length === 0) {
        throw new AppError("No data provided for update", 400);
      }

      const updatedMission = await missionService.editMission(id, updateData);
      if (!updatedMission) {
        throw new AppError("Mission not found", 404);
      }

      res.status(200).json(updatedMission);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves details of a single mission by its ID.
   * Takes the mission ID as a URL parameter and fetches the mission details from the service.
   * Sends a 200 status with the mission details.
   *
   * @async
   * @param {Object} req - Express request object, containing the mission ID in the URL parameters.
   * @param {Object} res - Express response object, which returns the details of the requested mission.
   * @param {Function} next - Express next middleware function (typically error handler).
   * @throws {AppError} - Status 404 if the mission is not found.
   * @returns {Promise<void>}
   */
  async getOneMission(req, res, next) {
    try {
      const { id } = req.params;

      const mission = await missionService.getOneMission(id);
      if (!mission) {
        throw new AppError("Mission not found", 404);
      }

      res.status(200).json(mission);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MissionController();
