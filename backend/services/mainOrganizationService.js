const { Main_Organization, Subsidiary, User } = require("../models");
const AppError = require("../utils/errorClass");
const Roles = require("../enums/roles");

class MainOrganizationService {
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
                where: { id: userId },
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
}

module.exports = new MainOrganizationService();
