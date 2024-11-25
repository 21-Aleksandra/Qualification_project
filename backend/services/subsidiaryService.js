const {
  Subsidiary,
  Photo_Set,
  Photo,
  Address,
  Main_Organization,
  User,
  Mission,
  Subsidiary_Mission,
  Subsidiary_Manager,
  Role,
} = require("../models");
const AppError = require("../utils/errorClass");
const { Op } = require("sequelize");
const { EMAIL_REGEX } = require("../utils/regexConsts");
const Roles = require("../enums/roles");

class SubsidiaryService {
  async getSubsidiaryFilteredList(filters = {}) {
    const {
      name,
      cities,
      countries,
      missions,
      mainOrganizationIds,
      sortBy,
      sortOrder,
      userId,
      userRole,
    } = filters;

    const whereConditions = {};
    const addressConditions = {};
    const missionConditions = {};
    const mainOrgConditions = {};

    if (name) whereConditions.name = { [Op.like]: `%${name}%` };
    if (cities?.length) addressConditions.city = { [Op.in]: cities };
    if (countries?.length) addressConditions.country = { [Op.in]: countries };
    if (missions?.length) missionConditions.id = { [Op.in]: missions };
    if (mainOrganizationIds?.length)
      mainOrgConditions.id = { [Op.in]: mainOrganizationIds };

    const validSortFields = ["name", "createdAt", "updatedAt"];
    const orderBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const order = ["asc", "desc"].includes(sortOrder) ? sortOrder : "desc";

    const subsidiaries = await Subsidiary.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: whereConditions,
      include: [
        {
          model: Address,
          attributes: ["city", "country", "street"],
          where: Object.keys(addressConditions).length
            ? addressConditions
            : undefined,
        },
        {
          model: Photo_Set,
          attributes: ["id"],
          include: [
            {
              model: Photo,
              attributes: ["url", "isBannerPhoto"],
            },
          ],
        },
        {
          model: Main_Organization,
          attributes: ["id", "name"],
          where: Object.keys(mainOrgConditions).length
            ? mainOrgConditions
            : undefined,
        },
        {
          model: Mission,
          through: { attributes: [] },
          attributes: ["id", "name"],
          where: Object.keys(missionConditions).length
            ? missionConditions
            : undefined,
        },
        {
          model: User,
          through: {
            model: Subsidiary_Manager,
            attributes: [],
          },
          attributes: ["id", "username"],
        },
      ],
      order: [[orderBy, order]],
    });

    if (!subsidiaries.length) {
      throw new AppError(
        "No subsidiaries found with the provided filters",
        404
      );
    }

    if (userId != null && userRole != null && userRole == Roles.MANAGER) {
      const user = await User.findByPk(userId, {
        include: {
          model: Role,
          attributes: ["id", "rolename"],
          where: { id: userRole },
        },
      });

      if (!user) {
        throw new AppError("User with specified role not found", 404);
      }

      const filteredSubsidiariesByManager = subsidiaries.filter((sub) =>
        sub.Users.some((user) => user.id === Number(userId))
      );

      return filteredSubsidiariesByManager;
    }

    return subsidiaries;
  }

  async getSubsidiaryById(id, userId, userRole) {
    const subsidiary = await Subsidiary.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: { id },
      include: [
        {
          model: Address,
          attributes: ["city", "country", "street"],
        },
        {
          model: Photo_Set,
          attributes: ["id"],
          include: [
            {
              model: Photo,
              attributes: ["url", "isBannerPhoto"],
            },
          ],
        },
        {
          model: Main_Organization,
          attributes: ["id", "name"],
        },
        {
          model: Mission,
          through: { attributes: [] },
          attributes: ["id", "name"],
        },
        {
          model: User,
          through: {
            model: Subsidiary_Manager,
            attributes: [],
          },
          attributes: ["id", "username"],
        },
      ],
    });

    if (!subsidiary) {
      throw new AppError(`Subsidiary with ID ${id} not found`, 404);
    }

    if (userId != null && userRole != null && userRole == Roles.MANAGER) {
      console.log("Checking manager role...");

      const user = await User.findByPk(userId, {
        include: {
          model: Role,
          attributes: ["id", "rolename"],
          where: { id: userRole },
        },
      });

      if (!user) {
        throw new AppError("User with specified role not found", 404);
      }

      const isManagerOfSubsidiary = subsidiary.Users.some(
        (u) => u.id === Number(userId)
      );

      if (!isManagerOfSubsidiary) {
        throw new AppError(
          "You are not allowed to access this subsidiary",
          403
        );
      }
    }

    return subsidiary;
  }

  async addSubsidiary({
    name,
    description,
    mainOrganizationId,
    foundedAt,
    addressId,
    email,
    website,
    staffCount,
    missions,
  }) {
    const photoSet = await Photo_Set.create({});

    if (!photoSet) {
      throw new AppError("Failed to create Photo_Set", 500);
    }

    if (email != null && !EMAIL_REGEX.test(email)) {
      throw AppError.badRequest("Invalid email format");
    }

    const newSubsidiary = await Subsidiary.create({
      name,
      description,
      mainOrganizationId,
      foundedAt,
      addressId,
      photoSetId: photoSet.id,
      email,
      website,
      staffCount,
    });

    if (!newSubsidiary) {
      throw new AppError("Failed to add subsidiary", 500);
    }

    if (missions && Array.isArray(missions)) {
      for (const missionId of missions) {
        await Subsidiary_Mission.findOrCreate({
          where: { subsidiaryId: newSubsidiary.id, missionId },
        });
      }
    }

    return newSubsidiary;
  }

  async editSubsidiary(
    id,
    {
      name,
      description,
      mainOrganizationId,
      foundedAt,
      addressId,
      email,
      website,
      staffCount,
      missions,
    }
  ) {
    const subsidiary = await Subsidiary.findByPk(id);
    if (!subsidiary) {
      throw new AppError(`Subsidiary with ID ${id} not found`, 404);
    }

    if (email != null && !EMAIL_REGEX.test(email)) {
      throw AppError.badRequest("Invalid email format");
    }

    await subsidiary.update({
      name,
      description,
      mainOrganizationId,
      foundedAt,
      addressId,
      email,
      website,
      staffCount,
    });

    if (missions && Array.isArray(missions)) {
      const existingMissionIds = await Subsidiary_Mission.findAll({
        where: { subsidiaryId: id },
        attributes: ["missionId"],
      }).then((rows) => rows.map((row) => row.missionId));

      const existingMissionIdsAsNumbers = existingMissionIds.map(Number);
      const missionsAsNumbers = missions.map(Number);

      const newMissions = missionsAsNumbers.filter(
        (missionId) => !existingMissionIdsAsNumbers.includes(missionId)
      );

      const removedMissionIds = existingMissionIdsAsNumbers.filter(
        (missionId) => !missionsAsNumbers.includes(missionId)
      );

      for (const missionId of newMissions) {
        await Subsidiary_Mission.findOrCreate({
          where: { subsidiaryId: id, missionId },
        });
      }

      if (removedMissionIds.length) {
        await Subsidiary_Mission.destroy({
          where: {
            subsidiaryId: id,
            missionId: { [Op.in]: removedMissionIds },
          },
        });
      }
    }
    return subsidiary;
  }

  async deleteSubsidiaries(ids) {
    const deletedCount = await Subsidiary.destroy({
      where: { id: { [Op.in]: ids } },
    });
    return deletedCount;
  }
}

module.exports = new SubsidiaryService();
