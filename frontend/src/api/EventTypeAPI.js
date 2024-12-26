import api from "./index";

/**
 * Retrieves a list of event types with optional filters.
 *
 * @param {Object} [filters={}] - Filters to apply when retrieving the event types (e.g.,userId and UserRoles).
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of event type objects.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const getEventTypeList = async (filters = {}) => {
  try {
    const response = await api.get("event-type/list", { params: filters });
    return response.data.eventTypes;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Adds a new event type to the system.
 *
 * @param {string} name - The name of the new event type.
 * @returns {Promise<Object>} - A promise that resolves to the response data confirming the event type was added.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const addEventType = async (name) => {
  try {
    const response = await api.post("event-type/add", { name });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Retrieves detailed information about a specific event type by its ID.
 *
 * @param {string} id - The ID of the event type to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the response data containing the event type details.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const getOneEventType = async (id) => {
  try {
    const response = await api.get(`event-type/${id}/get`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Updates an existing event type by its ID.
 *
 * @param {string} id - The ID of the event type to update.
 * @param {Object} updateData - The updated data for the event type (e.g., a new name).
 * @returns {Promise<Object>} - A promise that resolves to the response data confirming the event type was updated.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const editEventType = async (id, updateData) => {
  try {
    const response = await api.put(`event-type/${id}/edit`, updateData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
