import api from "./index";

export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post("auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.delete("auth/logout");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post("auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post(`auth/reset-password/${token}`, {
      newPassword: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await api.get(`auth/verify-email/${token}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const ckeckStatus = async () => {
  try {
    const response = await api.get(`auth/status`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
