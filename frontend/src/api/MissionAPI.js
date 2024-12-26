import api from "./index";

/**
 * Fetches the list of all missions.
 *
 * @async
 * @function getMissionList
 * @returns {Promise<Object>} The response data containing the list of missions.
 * @throws {Error} An error message or response data if the request fails.
 */
export const getMissionList = async () => {
  try {
    const response = await api.get("mission/list");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Adds a new mission.
 *
 * @async
 * @function addMission
 * @param {string} name - The name of the mission to be added.
 * @returns {Promise<Object>} The response data confirming the addition of the mission.
 * @throws {Error} An error message or response data if the request fails.
 */
export const addMission = async (name) => {
  try {
    const response = await api.post("mission/add", { name });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Fetches details of a single mission by its ID.
 *
 * @async
 * @function getOneMission
 * @param {string} id - The unique identifier of the mission.
 * @returns {Promise<Object>} The response data containing the mission details.
 * @throws {Error} An error message or response data if the request fails.
 */
export const getOneMission = async (id) => {
  try {
    const response = await api.get(`mission/${id}/get`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Updates an existing mission.
 *
 * @async
 * @function editMission
 * @param {string} id - The unique identifier of the mission to be updated.
 * @param {Object} updateData - The updated data for the mission(e.g name).
 * @returns {Promise<Object>} The response data confirming the update.
 * @throws {Error} An error message or response data if the request fails.
 */
export const editMission = async (id, updateData) => {
  try {
    const response = await api.put(`mission/${id}/edit`, updateData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
