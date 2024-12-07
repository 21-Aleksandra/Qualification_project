const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid").v4;
const AppError = require("../utils/errorClass");
const { Photo } = require("../models");

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

module.exports = { savePhoto };
