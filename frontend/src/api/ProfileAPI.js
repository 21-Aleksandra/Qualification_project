import api from "./index";

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

export const changeName = async (userId, name) => {
  try {
    const response = await api.put("profile/change-name", { userId, name });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

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
