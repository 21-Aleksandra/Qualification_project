const missionService = require("../services/missionService");
const AppError = require("../utils/errorClass");

class MissionController {
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
