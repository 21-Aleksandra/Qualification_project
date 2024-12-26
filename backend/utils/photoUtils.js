const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid").v4;
const AppError = require("../utils/errorClass");
const { Photo } = require("../models");

/**
 *
 * This function handles file validation (ensuring the file is of a valid type),
 * generates a unique file name, stores the photo in the specified directory,
 * and records the photo information in the database.
 *
 * @param {Object} photo - The photo object containing the file data.
 * @param {boolean} isBanner - Flag indicating if the photo is a banner.
 * @param {string} directory - The directory where the photo will be saved.
 * @param {string} photoSetId - The ID of the photo set this photo belongs to.
 * @throws {AppError} - Throws an error if the file type is invalid.
 * @returns {Promise<void>} - Returns a promise that resolves when the photo is saved.
 */
async function savePhoto(photo, isBanner, directory, photoSetId) {
  const extension = path.extname(photo.originalname || "").toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(extension)) {
    throw new AppError(
      "Invalid file type. Only jpg, jpeg, png are allowed.",
      400
    );
  }

  const fileName = `${uuidv4()}_${new Date()
    .toISOString()
    .replace(/[:.]/g, "-")}${extension}`;
  const filePath = path.join(directory, fileName);

  fs.writeFileSync(filePath, photo.buffer);

  await Photo.create({
    url: `${directory}${fileName}`,
    filename: fileName,
    type: extension.slice(1),
    photoSetId,
    isBannerPhoto: isBanner,
  });
}

/**
 *
 * This function validates the file type, generates a unique filename, saves single photo
 * to the specified directory, and records the photo information in the database.
 *
 * @param {Object} photo - The photo object containing the file data.
 * @param {string} directory - The directory where the photo will be saved.
 * @throws {AppError} - Throws an error if the file type is invalid.
 * @returns {Promise<Object>} - Returns a promise that resolves with the created Photo object.
 */
async function saveOnePhoto(photo, directory) {
  const extension = path.extname(photo.originalname || "").toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(extension)) {
    throw new AppError(
      "Invalid file type. Only jpg, jpeg, png are allowed.",
      400
    );
  }

  const fileName = `${uuidv4()}_${new Date()
    .toISOString()
    .replace(/[:.]/g, "-")}${extension}`;
  const filePath = path.join(directory, fileName);

  fs.mkdirSync(directory, { recursive: true });

  fs.writeFileSync(filePath, photo.buffer);

  const newPhoto = await Photo.create({
    url: `${directory}${fileName}`,
    filename: fileName,
    type: extension.slice(1),
  });

  return newPhoto;
}

module.exports = { savePhoto, saveOnePhoto };
