import api from "./index";

/**
 * Updates the user's profile picture.
 *
 * @async
 * @function changeProfilePic
 * @param {string} userId - The unique identifier of the user.
 * @param {File} profilePhoto - The new profile photo file.
 * @returns {Promise<Object>} The response data after changing the profile picture.
 * @throws {Error}  An error message or response data if the request fails.
 */
export const changeProfilePic = async (userId, profilePhoto) => {
  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("profilePhoto", profilePhoto);

  try {
    const response = await api.post("profile/change-profile-pic", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Updates the user's username.
 *
 * @async
 * @function changeName
 * @param {string} userId - The unique identifier of the user.
 * @param {string} name - The new name to update.
 * @returns {Promise<Object>} The response data after changing the name.
 * @throws {Error} An error message or response data if the request fails.
 */
export const changeName = async (userId, name) => {
  try {
    const response = await api.put("profile/change-name", { userId, name });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Changes the user's password.
 *
 * @async
 * @function changePassword
 * @param {string} userId - The unique identifier of the user.
 * @param {string} oldPassword - The user's current password.
 * @param {string} newPassword - The new password to set.
 * @returns {Promise<Object>} The response data after changing the password.
 * @throws {Error} An error message or response data if the request fails.
 */
export const changePassword = async (userId, oldPassword, newPassword) => {
  try {
    const response = await api.put("profile/change-password", {
      userId,
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Sends an email request to the user.
 *
 * @async
 * @function sendEmailRequest
 * @param {string} userId - The unique identifier of the user.
 * @param {Object} requestDetails - The details of the email request.
 * @returns {Promise<Object>} The response data after sending the email request.
 * @throws {Error} An error message or response data if the request fails.
 */
export const sendEmailRequest = async (userId, requestDetails) => {
  try {
    const response = await api.post("profile/send-email-request", {
      userId,
      requestDetails,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
/**
 * Deletes the user's account by user's Id.
 *
 * @async
 * @function deleteAccount
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<Object>} The response data after deleting the account.
 * @throws {Error} An error message or response data if the request fails.
 */
export const deleteAccount = async (userId) => {
  try {
    const response = await api.delete("profile/delete-account", {
      data: { userId },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
