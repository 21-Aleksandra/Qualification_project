const profileService = require("../services/profileService");
const AppError = require("../utils/errorClass");

/**
 * Controller for handling profile-related actions such as changing profile picture, name, password, and deleting account.
 * @class ProfileController
 */
class ProfileController {
  /**
   * Changes the profile picture of a user.
   * Verifies user ID from the request body against the session user ID for authorization.
   * Ensures a profile photo is provided and updates the user's profile picture through the service.
   *
   * Sends a status 200 response with the updated profile object.
   *
   * @async
   * @param {Object} req - Express request object, containing the user ID and profile photo file.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @throws {AppError} - Status 403 if unauthorized or invalid user ID.
   * @throws {AppError} - Status 400 if profile photo is missing.
   * @returns {Promise<void>}
   */
  async changeProfilePic(req, res, next) {
    try {
      const { userId } = req.body;
      const profilePhoto = req.files?.profilePhoto?.[0];
      if (!userId || Number(userId) !== req.session.user.id) {
        throw new AppError("Unauthorized or invalid user ID.", 403);
      }

      const result = await profileService.changeProfilePic(
        Number(userId),
        profilePhoto
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Changes the username of a user.
   * Verifies the user ID from the request body against the session user ID and validates the new name.
   * Updates the username via the service and reflects changes in the session.
   *
   * Sends a status 200 response with the updated username.
   *
   * @async
   * @param {Object} req - Express request object, containing the user ID and the new name.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @throws {AppError} - Status 403 if unauthorized or invalid user ID.
   * @throws {AppError} - Status 400 if the name is empty.
   * @returns {Promise<void>}
   */
  async changeName(req, res, next) {
    try {
      const { userId, name } = req.body;

      if (!userId || Number(userId) !== req.session.user.id) {
        throw new AppError("Unauthorized or invalid user ID.", 403);
      }

      if (!name || name.trim().length === 0) {
        throw new AppError("Name cannot be empty.", 400);
      }

      const result = await profileService.changeUsername(Number(userId), name);
      req.session.user.username = name;
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Changes the password of a user.
   * Validates the presence of old and new passwords and ensures the user ID matches the session.
   * Updates the password via the service and logs the user out after a successful change.
   *
   * Sends a status 200 response indicating successful password change.
   *
   * @async
   * @param {Object} req - Express request object, containing the user ID, old password, and new password.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @throws {AppError} - Status 403 if unauthorized or invalid user ID.
   * @throws {AppError} - Status 400 if old or new passwords are missing.
   * @returns {Promise<void>}
   */
  async changePassword(req, res, next) {
    try {
      const { userId, oldPassword, newPassword } = req.body;

      if (!userId || Number(userId) !== req.session.user.id) {
        throw new AppError("Unauthorized or invalid user ID.", 403);
      }

      if (!oldPassword || !newPassword) {
        throw new AppError("Both old and new passwords are required.", 400);
      }

      const result = await profileService.changePassword(
        Number(userId),
        oldPassword,
        newPassword
      );

      req.session.destroy((err) => {
        if (err) {
          return next(
            AppError.internalError("Could not log out. Please try again.")
          );
        }

        res.clearCookie("sessionId");
      });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Sends an email request to the admin for user-related queries or requests.
   * Validates the user ID matches the session user ID and checks that request details are provided.
   *
   * Sends a status 200 response indicating the email request was sent successfully.
   *
   * @async
   * @param {Object} req - Express request object, containing the user ID and request details.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @throws {AppError} - Status 403 if unauthorized or invalid user ID.
   * @throws {AppError} - Status 400 if request details are empty.
   * @returns {Promise<void>}
   */
  async sendEmailRequestToAdmin(req, res, next) {
    try {
      const { userId, requestDetails } = req.body;

      if (!userId || Number(userId) !== req.session.user.id) {
        throw new AppError("Unauthorized or invalid user ID.", 403);
      }

      if (!requestDetails || requestDetails.trim().length === 0) {
        throw new AppError("Request details cannot be empty.", 400);
      }

      const result = await profileService.sendEmailRequestToAdmin(
        Number(userId),
        requestDetails
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Deletes a user's account.
   * Ensures the user ID matches the session user ID and calls the service to delete the account.
   * After deletion, destroys the session and clears the session cookie.
   *
   * Sends a status 200 response indicating the account was deleted successfully.
   *
   * @async
   * @param {Object} req - Express request object, containing the user ID for account deletion.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @throws {AppError} - Status 403 if unauthorized or invalid user ID.
   * @returns {Promise<void>}
   */
  async deleteAccount(req, res, next) {
    try {
      const { userId } = req.body;

      if (!userId || Number(userId) !== req.session.user.id) {
        throw new AppError("Unauthorized or invalid user ID.", 403);
      }

      const result = await profileService.deleteAccount(Number(userId));

      req.session.destroy((err) => {
        if (err) {
          return next(
            AppError.internalError("Could not log out. Please try again.")
          );
        }

        res.clearCookie("sessionId");
        res.status(200).json(result);
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProfileController();
