import api from "./index";

/**
 * Registers a new user with the provided username, email, and password.
 *
 * @param {string} username - The username chosen by the user during registration.
 * @param {string} email - The email address of the user.
 * @param {string} password - The password chosen by the user.
 * @returns {Promise<Object>} - A promise that resolves to the response data containing user registration details.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
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

/**
 * Logs in a user with the provided email and password.
 *
 * @param {string} email - The email address of the user trying to log in.
 * @param {string} password - The password for the user.
 * @returns {Promise<Object>} - A promise that resolves to the response data containing user login details (e.g., data from session).
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Logs out the currently authenticated user.
 *
 * @returns {Promise<Object>} - A promise that resolves to the response data confirming the logout action.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const logoutUser = async () => {
  try {
    const response = await api.delete("auth/logout");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Requests a password reset link to be sent to the specified email address.
 *
 * @param {string} email - The email address of the user requesting a password reset.
 * @returns {Promise<Object>} - A promise that resolves to the response data containing a success message.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post("auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Resets the user's password using the provided reset jwt token and new password.
 *
 * @param {string} token - The token received via email for resetting the password.
 * @param {string} newPassword - The new password to be set for the user.
 * @returns {Promise<Object>} - A promise that resolves to the response data confirming the password reset.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
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

/**
 * Verifies the user's email address and account using the provided verification token.
 *
 * @param {string} token - The token sent to the user's email for email verification.
 * @returns {Promise<Object>} - A promise that resolves to the response data confirming the user verification status.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const verifyEmail = async (token) => {
  try {
    const response = await api.get(`auth/verify-email/${token}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Checks the current authentication status of the user (whether logged in or not).
 *
 * @returns {Promise<Object>} - A promise that resolves to the response data indicating the current user's authentication status and data.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const ckeckStatus = async () => {
  try {
    const response = await api.get(`auth/status`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
