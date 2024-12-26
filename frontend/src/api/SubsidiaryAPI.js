import api from "./index";

/**
 * Retrieves the list of subsidiaries filtered by the given parameters.
 *
 * @async
 * @function getSubsidiaryFilteredList
 * @param {Object} [filters={}] - The filters to apply to the request(name, main organizations, missions etc.).
 * @returns {Promise<Object>} The response data containing the list of subsidiaries.
 * @throws {Error} An error message or response data if the request fails.
 */
export const getSubsidiaryFilteredList = async (filters = {}) => {
  try {
    const response = await api.get("subsidiary/list", { params: filters });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Retrieves a subsidiary by its ID, with optional user information.
 *
 * @async
 * @function getSubsidiaryById
 * @param {string} id - The ID of the subsidiary.
 * @param {string} userId - The ID of the user requesting the data.
 * @param {string} userRole - The role of the user requesting the data.
 * @returns {Promise<Object>} The response data containing the subsidiary information.
 * @throws {Error} An error message or response data if the request fails.
 */
export const getSubsidiaryById = async (id, userId, userRole) => {
  try {
    const response = await api.get(`subsidiary/${id}`, {
      params: { userId, userRole },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Retrieves the names of subsidiaries based on the given filters(userId, userRoles).
 *
 * @async
 * @function getSubsidiaryNames
 * @param {Object} [filters={}] - The filters to apply to the request.
 * @returns {Promise<Object>} The response data containing the subsidiary names.
 * @throws {Error} An error message or response data if the request fails.
 */
export const getSubsidiaryNames = async (filters = {}) => {
  try {
    const response = await api.get(`subsidiary/get/names`, { params: filters });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Adds a new subsidiary with the provided data.
 *
 * @async
 * @function addSubsidiary
 * @param {Object} subsidiaryData - The data (including photos) of the subsidiary to add.
 * @returns {Promise<Object>} The response data confirming the subsidiary creation.
 * @throws {Error} An error message or response data if the request fails.
 */
export const addSubsidiary = async (subsidiaryData) => {
  try {
    const response = await api.post("subsidiary/add", subsidiaryData, {
      headers: { "Content-Type": "multipart/form-data" }, // for file upload
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Edits an existing subsidiary by ID with the provided data.
 *
 * @async
 * @function editSubsidiary
 * @param {string} id - The ID of the subsidiary to edit.
 * @param {Object} subsidiaryData - The updated data of the subsidiary.
 * @returns {Promise<Object>} The response data confirming the subsidiary update.
 * @throws {Error} An error message or response data if the request fails.
 */
export const editSubsidiary = async (id, subsidiaryData) => {
  try {
    const response = await api.put(`subsidiary/${id}/edit`, subsidiaryData, {
      headers: { "Content-Type": "multipart/form-data" }, // for file upload
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Deletes subsidiaries by their IDs.
 *
 * @async
 * @function deleteSubsidiaries
 * @param {Array<string>} ids - The IDs of the subsidiaries to delete.
 * @returns {Promise<Object>} The response data confirming the deletion.
 * @throws {Error} An error message or response data if the request fails.
 */
export const deleteSubsidiaries = async (ids) => {
  try {
    const response = await api.delete("subsidiary/delete", { data: { ids } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Updates the manager list for a given subsidiary.
 *
 * @async
 * @function updateManagers
 * @param {string} subsidiaryId - The ID of the subsidiary.
 * @param {Array<string>} managerIds - The IDs of the managers to assign to the subsidiary.
 * @returns {Promise<Object>} The response data confirming the manager update.
 * @throws {Error} An error message or response data if the request fails.
 */
export const updateManagers = async (subsidiaryId, managerIds) => {
  try {
    const response = await api.put(
      `/subsidiary/${subsidiaryId}/change-managers`,
      {
        managerIds,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
