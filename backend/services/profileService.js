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

/**
 * Service for managing user profiles.
 * Provides operations like updating profile pictures, changing usernames and passwords,
 * sending email requests to administrators, and deleting user accounts.
 * Handles validation, security checks, and error handling for all profile-related operations.
 * @class ProfileService
 */

class ProfileService {
  /**
   * Changes the user's profile picture.
   * Deletes the old photo if it exists, uploads the new photo, and updates the user's record.
   * @async
   * @param {number} userId - ID of the user updating their profile picture.
   * @param {Object} profilePhoto - New profile photo file object.
   * @returns {Promise<Object>} - Message and URL of the updated profile photo.
   * @throws {AppError} - If the user is not found or no photo is provided.
   */
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

    // Case when a new photo is provided.
    if (profilePhoto) {
      if (existingPhoto) {
        // If there is an existing photo, delete the file and the photo record.
        await fs.promises.unlink(path.join(parentDir, existingPhoto.url));
        await existingPhoto.destroy();
      }
      // Save the new photo and update the user's photoId.
      const newPhoto = await saveOnePhoto(profilePhoto, profileImagePath);
      user.photoId = newPhoto.id;
      newPhotoUrl = newPhoto.url;
    } else if (existingPhoto) {
      // Case when no new photo provided, but an existing photo exists.
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

  /**
   * Changes the username of the user.
   * Validates the username format and checks for profanity or duplication.
   * @async
   * @param {number} userId - ID of the user updating their username.
   * @param {string} username - New username.
   * @returns {Promise<Object>} - Message indicating success.
   * @throws {AppError} - If the user is not found, username is invalid, or already taken.
   */
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

    // Checking if username has any inappropriate language
    if (filter.isProfane(username)) {
      throw new AppError("Username contains inappropriate language.", 400);
    }

    // ensuring usernames are unique
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

  /**
   * Changes the user's password.
   * Verifies the old password and validates the new password format.
   * @async
   * @param {number} userId - ID of the user changing their password.
   * @param {string} oldPassword - Current password for verification.
   * @param {string} newPassword - New password to set.
   * @returns {Promise<Object>} - Message indicating success.
   * @throws {AppError} - If the user is not found, old password is incorrect, or new password is invalid.
   */
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

  /**
   * Constructs the request message and sends it to all users with admin roles.
   * @async
   * @param {number} userId - ID of the user making the request.
   * @param {string} requestDetails - Details of the request to send to admins.
   * @returns {Promise<Object>} - Message indicating success.
   * @throws {AppError} - If the user or admin users are not found, or sequence record is missing.
   */
  async sendEmailRequestToAdmin(userId, requestDetails) {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    // making the right format for emails
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
        `Request ${sequenceNumber}` // for unique number of each request
      );
    }

    return { message: "Request sent to admin successfully." };
  }

  /**
   * Deletes a user's account permanently.
   * @async
   * @param {number} userId - ID of the user to delete.
   * @returns {Promise<Object>} - Message indicating success.
   * @throws {AppError} - If the user is not found.
   */
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
