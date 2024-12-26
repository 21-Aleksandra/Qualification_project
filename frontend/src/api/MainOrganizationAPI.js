import api from "./index";

/**
 * Fetches a list of main organizations, with optional filters.
 *
 * @async
 * @function getMainOrganizationList
 * @param {Object} [filters={}] - Filters to refine the query (e.g., pagination, search terms).
 * @returns {Promise<Object>} The response data containing the list of main organizations.
 * @throws {Error} An error message or response data if the request fails.
 */
export const getMainOrganizationList = async (filters = {}) => {
  try {
    const response = await api.get("main-organization/list", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Adds a new main organization.
 *
 * @async
 * @function addMainOrganization
 * @param {string} name - The name of the main organization to be added.
 * @returns {Promise<Object>} The response data confirming the addition of the organization.
 * @throws {Error} An error message or response data if the request fails.
 */
export const addMainOrganization = async (name) => {
  try {
    const response = await api.post("main-organization/add", { name });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Fetches details of a single main organization by its ID.
 *
 * @async
 * @function getOneMainOrganization
 * @param {string} id - The unique identifier of the main organization.
 * @returns {Promise<Object>} The response data containing the organization details.
 * @throws {Error} An error message or response data if the request fails.
 */
export const getOneMainOrganization = async (id) => {
  try {
    const response = await api.get(`main-organization/${id}/get`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Updates an existing main organization.
 *
 * @async
 * @function editMainOrganization
 * @param {string} id - The unique identifier of the main organization to be updated.
 * @param {Object} updateData - The updated data for the main organization.
 * @returns {Promise<Object>} The response data confirming the update.
 * @throws {Error} An error message or response data if the request fails.
 */
export const editMainOrganization = async (id, updateData) => {
  try {
    const response = await api.put(`main-organization/${id}/edit`, updateData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
