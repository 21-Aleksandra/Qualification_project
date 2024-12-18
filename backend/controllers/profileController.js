const profileService = require("../services/profileService");
const AppError = require("../utils/errorClass");

class ProfileController {
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
