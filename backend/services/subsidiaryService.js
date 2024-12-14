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
const path = require("path");
const fs = require("fs");
const { savePhoto } = require("../utils/photoUtils");

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
      userRoles,
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
          attributes: ["city", "country", "street", "lat", "lng"],
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
      return [];
    }

    if (userId != null && userRoles && userRoles.includes(Roles.MANAGER)) {
      const user = await User.findByPk(userId, {
        include: {
          model: Role,
          attributes: ["id", "rolename"],
          where: { id: { [Op.in]: userRoles } },
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

  async getSubsidiaryById(id, userId, userRoles) {
    const subsidiary = await Subsidiary.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: { id },
      include: [
        {
          model: Address,
          attributes: ["city", "country", "street", "lat", "lng"],
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

    if (userId != null && userRoles && userRoles.includes(Roles.MANAGER)) {
      const user = await User.findByPk(userId, {
        include: {
          model: Role,
          attributes: ["id", "rolename"],
          where: { id: { [Op.in]: userRoles } },
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

  async findSubsidiaryNames(userId, userRoles) {
    if (userId && userRoles && userRoles.includes(Roles.MANAGER)) {
      return await Subsidiary.findAll({
        attributes: ["id", "name"],
        include: [
          {
            model: User,
            through: {
              model: Subsidiary_Manager,
              attributes: [],
            },
            where: { id: userId },
            attributes: [],
          },
        ],
      });
    }

    return await Subsidiary.findAll({
      attributes: ["id", "name"],
    });
  }

  async addSubsidiary({
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
  }) {
    if (email && !EMAIL_REGEX.test(email)) {
      throw new AppError("Invalid email format", 400);
    }

    const photoSet = await Photo_Set.create({});
    if (!photoSet) {
      throw new AppError("Failed to create Photo_Set", 500);
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

    if (missions) {
      const missionsArray = Array.isArray(missions) ? missions : [missions];

      for (const missionId of missionsArray) {
        const missionExists = await Mission.findByPk(missionId);
        if (!missionExists) {
          throw new AppError(`Mission with ID ${missionId} not found`, 404);
        }
        await Subsidiary_Mission.findOrCreate({
          where: { subsidiaryId: newSubsidiary.id, missionId },
        });
      }
    }

    const photosDirectory =
      process.env.SUBSIDIARY_IMAGE_PATH || "static/subsidiaryPhotos";
    if (!fs.existsSync(photosDirectory)) {
      fs.mkdirSync(photosDirectory, { recursive: true });
    }

    if (bannerPhoto) {
      await savePhoto(bannerPhoto, true, photosDirectory, photoSet.id);
    }

    if (otherPhotos && Array.isArray(otherPhotos)) {
      if (otherPhotos.length > 3) {
        throw new AppError("Cannot upload more than 3 other photos.", 400);
      }
      for (const photo of otherPhotos) {
        await savePhoto(photo, false, photosDirectory, photoSet.id);
      }
    }

    await Subsidiary_Manager.create({
      managerId,
      subsidiaryId: newSubsidiary.id,
    });

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
      bannerPhoto,
      otherPhotos,
    }
  ) {
    const subsidiary = await Subsidiary.findByPk(id);
    if (!subsidiary) {
      throw new AppError(`Subsidiary with ID ${id} not found`, 404);
    }

    if (email && !EMAIL_REGEX.test(email)) {
      throw new AppError("Invalid email format", 400);
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

    if (missions) {
      const missionsArray = Array.isArray(missions) ? missions : [missions];

      const existingMissionIds = await Subsidiary_Mission.findAll({
        where: { subsidiaryId: id },
        attributes: ["missionId"],
      }).then((rows) => rows.map((row) => row.missionId));

      const existingMissionIdsAsNumbers = existingMissionIds.map(Number);
      const missionsAsNumbers = missionsArray.map(Number);

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

    const existingBannerPhoto = await Photo.findOne({
      where: { photoSetId: subsidiary.photoSetId, isBannerPhoto: true },
    });

    const parentDir = path.resolve(__dirname, "..");

    if (bannerPhoto) {
      if (
        !existingBannerPhoto ||
        existingBannerPhoto.filename !== bannerPhoto.originalname
      ) {
        if (existingBannerPhoto) {
          await fs.promises.unlink(
            path.join(parentDir, `${existingBannerPhoto.url}`)
          );
          await existingBannerPhoto.destroy();
        }
        await savePhoto(
          bannerPhoto,
          true,
          process.env.SUBSIDIARY_IMAGE_PATH,
          subsidiary.photoSetId
        );
      }
    } else if (existingBannerPhoto) {
      await fs.promises.unlink(
        path.join(parentDir, `${existingBannerPhoto.url}`)
      );
      await existingBannerPhoto.destroy();
    }

    const existingOtherPhotos = await Photo.findAll({
      where: { photoSetId: subsidiary.photoSetId, isBannerPhoto: false },
    });

    const existingFilenames = existingOtherPhotos.map(
      (photo) => photo.filename
    );
    const incomingFilenames = otherPhotos
      ? otherPhotos.map((photo) => photo.originalname)
      : [];

    const photosToDelete = existingOtherPhotos.filter(
      (photo) => !incomingFilenames.includes(photo.filename)
    );
    for (const photo of photosToDelete) {
      await fs.promises.unlink(path.join(parentDir, `${photo.url}`));
      await photo.destroy();
    }

    const photosToAdd = otherPhotos
      ? otherPhotos.filter(
          (photo) => !existingFilenames.includes(photo.originalname)
        )
      : [];

    if (
      existingOtherPhotos.length - photosToDelete.length + photosToAdd.length >
      3
    ) {
      throw new AppError("Cannot upload more than 3 other photos.", 400);
    }

    for (const photo of photosToAdd) {
      await savePhoto(
        photo,
        false,
        process.env.SUBSIDIARY_IMAGE_PATH,
        subsidiary.photoSetId
      );
    }

    return subsidiary;
  }

  async deleteSubsidiaries(ids) {
    const subsidiaries = await Subsidiary.findAll({
      where: { id: { [Op.in]: ids } },
      include: [{ model: Photo_Set, include: [Photo] }],
    });

    if (subsidiaries.length === 0) {
      throw new AppError("No subsidiaries found with the provided IDs", 404);
    }

    const parentDir = path.resolve(__dirname, "..");

    for (const subsidiary of subsidiaries) {
      if (subsidiary.Photo_Set && subsidiary.Photo_Set.Photos) {
        for (const photo of subsidiary.Photo_Set.Photos) {
          const photoPath = path.join(parentDir, photo.url);
          if (fs.existsSync(photoPath)) {
            await fs.promises.unlink(photoPath);
          }
          await photo.destroy();
        }
      }
    }

    const deletedCount = await Subsidiary.destroy({
      where: { id: { [Op.in]: ids } },
    });

    return deletedCount;
  }
}

module.exports = new SubsidiaryService();
