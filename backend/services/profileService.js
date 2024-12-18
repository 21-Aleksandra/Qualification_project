const { User, Photo, Role, Request_Sequences } = require("../models");
const AppError = require("../utils/errorClass");
const Filter = require("bad-words");
const { USERNAME_REGEX, PASSWORD_REGEX } = require("../utils/regexConsts");
const { saveOnePhoto } = require("../utils/photoUtils");
const emailService = require("./emailService");
const Roles = require("../enums/roles");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const filter = new Filter();
const SequenceCodes = require("../enums/sequenceCodes");

class ProfileService {
  async changeProfilePic(userId, profilePhoto) {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const parentDir = path.resolve(__dirname, "..");
    const profileImagePath = process.env.USER_IMAGE_PATH;

    let newPhotoUrl = null;
    const existingPhoto = user.photoId
      ? await Photo.findOne({ where: { id: user.photoId } })
      : null;

    if (profilePhoto) {
      if (existingPhoto) {
        await fs.promises.unlink(path.join(parentDir, existingPhoto.url));
        await existingPhoto.destroy();
      }

      const newPhoto = await saveOnePhoto(profilePhoto, profileImagePath);
      user.photoId = newPhoto.id;
      newPhotoUrl = newPhoto.url;
    } else if (existingPhoto) {
      await fs.promises.unlink(path.join(parentDir, existingPhoto.url));
      await existingPhoto.destroy();
      user.photoId = null;
    } else {
      throw new AppError(
        "No photo provided and no existing photo to delete.",
        400
      );
    }

    await user.save();
    return {
      message: "Profile picture updated successfully.",
      photoUrl: newPhotoUrl,
    };
  }

  async changeUsername(userId, username) {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    if (!USERNAME_REGEX.test(username)) {
      throw new AppError(
        "Username must be 3-255 characters long and can only contain English letters, numbers, or underscores.",
        400
      );
    }

    if (filter.isProfane(username)) {
      throw new AppError("Username contains inappropriate language.", 400);
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser && existingUser.id !== userId) {
      throw new AppError(
        "Username is already taken. Please choose another one.",
        400
      );
    }

    user.username = username;
    await user.save();

    return { message: "Username updated successfully." };
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError("Old password is incorrect.", 401);
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      throw new AppError(
        "Password must be 8-80 characters, include at least one uppercase letter, one lowercase letter, one digit, and one special character (! . - _).",
        400
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return { message: "Password updated successfully." };
  }

  async sendEmailRequestToAdmin(userId, requestDetails) {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const modifiedDetails = `The user ${user.username} (id: ${user.id}) says:\n${requestDetails}`;

    const adminUsers = await User.findAll({
      include: [
        {
          model: Role,
          where: { id: Roles.ADMIN },
        },
      ],
      distinct: true,
    });

    if (!adminUsers.length) {
      throw new AppError("No admins found to send the request to.", 404);
    }

    const sequenceRecord = await Request_Sequences.findOne({
      where: { code: SequenceCodes.ADMIN_REQUEST },
    });

    if (!sequenceRecord) {
      throw new AppError("Sequence record not found.", 404);
    }

    const sequenceNumber = sequenceRecord.number;
    console.log(sequenceRecord);

    sequenceRecord.number += 1;
    await sequenceRecord.save();

    for (const admin of adminUsers) {
      await emailService.SendMail(
        admin.email,
        "adminRequest",
        modifiedDetails,
        `Request ${sequenceNumber}`
      );
    }

    return { message: "Request sent to admin successfully." };
  }

  async deleteAccount(userId) {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    await user.destroy();

    return { message: "Account deleted successfully." };
  }
}

module.exports = new ProfileService();
