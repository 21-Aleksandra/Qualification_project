const { Mission } = require("../models");
const AppError = require("../utils/errorClass");
const { MISSION_NAME_REGEX } = require("../utils/regexConsts");

class MissionService {
  async getMissionList() {
    const missions = await Mission.findAll({
      order: [["name", "ASC"]],
    });
    return missions;
  }

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
}

module.exports = new MissionService();
