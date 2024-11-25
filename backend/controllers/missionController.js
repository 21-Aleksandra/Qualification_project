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
        mission: newMission,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MissionController();
