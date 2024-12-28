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
  Comment_Set,
  News_Set,
  Role,
} = require("../models");
const AppError = require("../utils/errorClass");
const { Op } = require("sequelize");
const { EMAIL_REGEX } = require("../utils/regexConsts");
const Roles = require("../enums/roles");
const path = require("path");
const fs = require("fs");
const { savePhoto } = require("../utils/photoUtils");

/**
 * Service for managing subsidiaries.
 * Provides operations like filtering, fetching by ID,adding,editing,
 * deleting and checking subsidiary, getting names.
 * Includes additional user-based filters for managers for get requests.
 * @class SubsidiaryService
 */
class SubsidiaryService {
  /**
   * Retrieves a filtered list of subsidiaries based on the provided filters.
   * If the user is a manager, it further filters the subsidiaries to only those the manager manages.
   * @async
   * @param {Object} filters - The filters to apply to the subsidiary search(name, cities, countries, missions, and main organizations).
   *                           Supports orting the results based on specified fields and order.
   * @returns {Promise<Array>} - A list of filtered subsidiaries.
   *  @throws {AppError} - If the user that is manager is not found
   */
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

    // checking the lenght if we expect multiple parametrs of the cathegory
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

  /**
   * Retrieves a subsidiary by its ID, including detailed information like address,
   * photo set, missions, and users. If the user is a manager, it ensures the user has
   * permission to access the subsidiary.
   * @async
   * @param {number} id - The ID of the subsidiary to retrieve.
   * @param {number} userId - The ID of the user making the request.
   * @param {Array<string>} userRoles - Roles associated with the user.
   * @returns {Promise<Object>} - The subsidiary details.
   * @throws {AppError} - If the subsidiary is not found or if the user does not have access.
   */
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

  /**
   * Retrieves a list of subsidiary names. If the user is a manager, only subsidiaries
   * they are associated with are returned.
   * @async
   * @param {number} userId - The ID of the user requesting the subsidiary names.
   * @param {Array<string>} userRoles - Roles associated with the user.
   * @returns {Promise<Array>} - A list of subsidiary names.
   */
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

  /**
   * Adds a new subsidiary to the database, setting up its details, photo set, news set, and comment set.
   * Handles uploading banner and other photos to the server and initializes related resources.
   *
   * @async
   * @param {number} managerId - The ID of the manager creating the subsidiary.
   * @param {string} name - The name of the subsidiary.
   * @param {string} description - A detailed description of the subsidiary.
   * @param {number} mainOrganizationId - The ID of the main organization to which the subsidiary belongs.
   * @param {Date} foundedAt - The date when the subsidiary was founded.
   * @param {number} addressId - The ID of the address where the subsidiary is located.
   * @param {string} email - The contact email of the subsidiary.
   * @param {string} website - The website URL of the subsidiary.
   * @param {number} staffCount - The number of staff members in the subsidiary.
   * @param {Array<Object>} missions - A list of missions associated with the subsidiary.
   * @param {Object} bannerPhoto - A file  for the main banner photo of the subsidiary.
   * @param {Array<Object>} otherPhotos - A list of additional photos for the subsidiary.
   *
   * @returns {Promise<Object>} - The created subsidiary object.
   * @throws {AppError} - If required data is missing, invalid, or if there are issues with photo uploads.
   */

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

    const newsSet = await News_Set.create({});
    if (!photoSet) {
      throw new AppError("Failed to create News_Set", 500);
    }

    const commentSet = await Comment_Set.create({});
    if (!photoSet) {
      throw new AppError("Failed to create Comment_Set", 500);
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
      newsSetId: newsSet.id,
      commentSetId: commentSet.id,
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

  /**
   * Updates an existing subsidiary, including its details, associated photos, and missions.
   * Handles correct behavior when photos or missions are added or removed, ensuring updates are reflected
   * in the server's filesystem and database.
   *
   * @async
   * @param {number} subsidiaryId - The ID of the subsidiary to update.
   * @param {string} [name] - The updated name of the subsidiary.
   * @param {string} [description] - The updated description of the subsidiary.
   * @param {number} [mainOrganizationId] - The updated ID of the main organization to which the subsidiary belongs.
   * @param {Date} [foundedAt] - The updated date when the subsidiary was founded.
   * @param {number} [addressId] - The updated ID of the subsidiary's address.
   * @param {string} [email] - The updated contact email of the subsidiary.
   * @param {string} [website] - The updated website URL of the subsidiary.
   * @param {number} [staffCount] - The updated number of staff members in the subsidiary.
   * @param {Array<Object>} [missions] - The updated list of missions associated with the subsidiary.
   * @param {Object} [bannerPhoto] - The updated banner photo for the subsidiary.
   * @param {Array<Object>} [otherPhotos] - The updated list of additional photos for the subsidiary.
   *
   * @returns {Promise<Object>} - The updated subsidiary object.
   * @throws {AppError} - If the subsidiary is not found, invalid data is provided, or updates fail or user not allowed to edit.
   */

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
      userId = null,
    }
  ) {
    const subsidiary = await Subsidiary.findByPk(id);
    if (!subsidiary) {
      throw new AppError(`Subsidiary with ID ${id} not found`, 404);
    }

    if (userId != null) {
      const managers = await Subsidiary_Manager.findAll({
        where: { subsidiaryId: subsidiary.id },
        attributes: ["managerId"],
      });

      const managerIds = managers.map((manager) => manager.managerId);

      if (!managerIds.includes(userId)) {
        throw new AppError(`You are not a manager of this subsidiary`, 403);
      }
    }

    if (email && !EMAIL_REGEX.test(email)) {
      throw new AppError("Invalid email format", 400);
    }

    const parsedFields = {
      mainOrganizationId:
        mainOrganizationId && mainOrganizationId !== ""
          ? mainOrganizationId
          : null,
      foundedAt: foundedAt ? new Date(foundedAt) : null,
      addressId: addressId && addressId !== "" ? addressId : null,
      staffCount:
        staffCount && !isNaN(staffCount) ? parseInt(staffCount, 10) : null,
    };

    if (foundedAt && isNaN(parsedFields.foundedAt)) {
      throw new AppError("Invalid date format for 'foundedAt'", 400);
    }

    const updateFields = {};
    Object.entries({
      name,
      description,
      email,
      website,
      ...parsedFields,
    }).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        updateFields[key] = value;
      }
    });

    await subsidiary.update(updateFields);
    if (missions) {
      const missionsArray = Array.isArray(missions) ? missions : [missions];

      //Determine whitch missions were deleted from list and whitch added
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
          // if new photo - recreate the photo
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
      // if photo was removed
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

  /**
   * Deletes subsidiaries by their IDs, including associated files and records (e.g. photos)
   *
   * @param {Array} ids - The IDs of the subsidiaries to delete.
   * @returns {Promise<void>} - Resolves when the deletion is complete.
   * @throws {AppError} - Throws an error if any subsidiary cannot be deleted.
   */
  async deleteSubsidiaries(ids) {
    const subsidiaries = await Subsidiary.findAll({
      where: { id: { [Op.in]: ids } },
      include: [{ model: Photo_Set, include: [Photo] }],
    });

    if (subsidiaries.length === 0) {
      throw new AppError("No subsidiaries found with the provided IDs", 404);
    }

    const parentDir = path.resolve(__dirname, "..");

    // deleteing photos in file system and datavase if subsidiary is deleted
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
  /**
   * Retrieves the comment set associated with a subsidiary by its ID.
   * If the subsidiary or its comment set is not found, an error is thrown.
   *
   * @param {number} id - The ID of the subsidiary whose comment set is to be fetched.
   * @returns {Promise<Object>} - The comment set associated with the subsidiary.
   * @throws {AppError} - Throws an error if the subsidiary or comment set is not found.
   */
  async getSubsidiaryCommentSetById(id) {
    const subsidiary = await Subsidiary.findByPk(id);

    if (!subsidiary) {
      throw new AppError("Subsidiary not found", 404);
    }

    const commentSet = await Comment_Set.findByPk(subsidiary.commentSetId);

    if (!commentSet) {
      throw new AppError("Comment set not found for this subsidiary", 404);
    }

    return commentSet;
  }

  /**
   * Retrieves the news set associated with a subsidiary by its ID.
   * If the subsidiary or its news set is not found, an error is thrown.
   *
   * @param {number} id - The ID of the subsidiary whose news set is to be fetched.
   * @returns {Promise<Object>} - The news set associated with the subsidiary.
   * @throws {AppError} - Throws an error if the subsidiary or news set is not found.
   */
  async getSubsidiaryNewsSetById(id) {
    const subsidiary = await Subsidiary.findByPk(id);

    if (!subsidiary) {
      throw new AppError("Subsidiary not found", 404);
    }

    const newsSet = await News_Set.findByPk(subsidiary.newsSetId);

    if (!newsSet) {
      throw new AppError("News set not found for this subsidiary", 404);
    }

    return newsSet;
  }

  /**
   * Updates the managers of a subsidiary by comparing the current list with the new list.
   * Adds new managers and removes old managers as necessary.
   *
   * @param {number} subsidiaryId - The ID of the subsidiary whose managers need to be updated.
   * @param {Array<number>} newManagerIds - The list of manager IDs to be set for the subsidiary.
   * @returns {Promise<Object>} - The added and removed manager IDs.
   * @throws {AppError} - Throws an error if the operation fails.
   */
  async updateManagers(subsidiaryId, newManagerIds) {
    const subsidiary = await Subsidiary.findByPk(subsidiaryId);

    if (!subsidiary) {
      throw new AppError("Subsidiary not found", 404);
    }
    const existingManagerIds = await Subsidiary_Manager.findAll({
      where: { subsidiaryId },
      attributes: ["managerId"],
    }).then((rows) => rows.map((row) => row.managerId));

    const existingManagerIdsAsNumbers = existingManagerIds.map(Number);
    const newManagerIdsAsNumbers = newManagerIds.map(Number);

    const managersToAdd = newManagerIdsAsNumbers.filter(
      (managerId) => !existingManagerIdsAsNumbers.includes(managerId)
    );

    const managersToRemove = existingManagerIdsAsNumbers.filter(
      (managerId) => !newManagerIdsAsNumbers.includes(managerId)
    );

    for (const managerId of managersToAdd) {
      await Subsidiary_Manager.create({ subsidiaryId, managerId });
    }

    if (managersToRemove.length) {
      await Subsidiary_Manager.destroy({
        where: {
          subsidiaryId,
          managerId: { [Op.in]: managersToRemove },
        },
      });
    }

    return {
      addedManagers: managersToAdd,
      removedManagers: managersToRemove,
    };
  }
}

module.exports = new SubsidiaryService();
