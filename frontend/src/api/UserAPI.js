import api from "./index";

/**
 * Retrieves a list of users filtered by the given parameters( id,username e.g.).
 *
 * @async
 * @function getUsers
 * @param {Object} [filters={}] - The filters to apply to the request.
 * @returns {Promise<Object>} The response data containing the list of users.
 * @throws {Error} An error message or response data if the request fails.
 */
export const getUsers = async (filters = {}) => {
  try {
    const response = await api.get("user/get", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Retrieves a user by their ID.
 *
 * @async
 * @function getOneUser
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<Object>} The response data containing the user information.
 * @throws {Error} An error message or response data if the request fails.
 */
export const getOneUser = async (id) => {
  try {
    const response = await api.get(`user/${id}/get`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Adds a new user with the provided data.
 *
 * @async
 * @function addUser
 * @param {string} username - The username of the new user.
 * @param {string} password - The password for the new user.
 * @param {string} email - The email address for the new user.
 * @param {Array<string>} roles - The roles assigned to the new user.
 * @param {boolean} isVerified - Whether the user is verified or not.
 * @returns {Promise<Object>} The response data confirming the user creation.
 * @throws {Error} An error message or response data if the request fails.
 */
export const addUser = async ({
  username,
  password,
  email,
  roles,
  isVerified,
}) => {
  try {
    const response = await api.post("user/add", {
      username,
      password,
      email,
      roles,
      isVerified,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Edits an existing user by their ID with the provided data.
 *
 * @async
 * @function editUser
 * @param {string} id - The ID of the user to edit.
 * @param {Object} updateData - The updated data for the user.
 * @param {string} updateData.username - The new username for the user.
 * @param {string} updateData.email - The new email for the user.
 * @param {string} updateData.password - The new password for the user.
 * @param {Array<string>} updateData.roles - The updated roles for the user.
 * @param {boolean} updateData.isVerified - The updated verification status for the user.
 * @returns {Promise<Object>} The response data confirming the user update.
 * @throws {Error} An error message or response data if the request fails.
 */
export const editUser = async (
  id,
  { username, email, password, roles, isVerified }
) => {
  try {
    const response = await api.put(`user/${id}/edit`, {
      username,
      email,
      password,
      roles,
      isVerified,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Deletes users by their IDs.
 *
 * @async
 * @function deleteUsers
 * @param {Array<string>} ids - The IDs of the users to delete.
 * @returns {Promise<Object>} The response data confirming the deletion.
 * @throws {Error} An error message or response data if the request fails.
 */
export const deleteUsers = async (ids) => {
  try {
    const response = await api.delete("user/delete", { data: { ids } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
