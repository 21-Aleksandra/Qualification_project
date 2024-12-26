import api from "./index";

/**
 * Fetches a filtered list of events based on the provided filters.
 *
 * @param {Object} [filters={}] - The filters to apply when retrieving the events (e.g., name, description, dateFrom ect).
 * @returns {Promise<Object>} - A promise that resolves to the response data containing the filtered list of events.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const getEventFilteredList = async (filters = {}) => {
  try {
    const response = await api.get("event/list", { params: filters });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Retrieves detailed information about a specific event by its ID.
 *
 * @param {string} id - The ID of the event to retrieve.
 * @param {string} [userId] - The ID of the user making the request (optional).
 * @param {Array<string>} [userRoles] - The roles of the user making the request (optional).
 * @returns {Promise<Object>} - A promise that resolves to the response data containing the event details.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const getEventById = async (id, userId, userRoles) => {
  try {
    const response = await api.get(`event/${id}`, {
      params: { userId, userRoles },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Adds a new event to the system.
 *
 * @param {Object} eventData - The data for the event to be added, including form fields and file uploads.
 * @returns {Promise<Object>} - A promise that resolves to the response data confirming the event was added.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const addEvent = async (eventData) => {
  try {
    const response = await api.post("event/add", eventData, {
      headers: { "Content-Type": "multipart/form-data" }, // for file upload
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Edits an existing event by its ID.
 *
 * @param {string} id - The ID of the event to edit.
 * @param {Object} eventData - The updated data for the event, including form fields and file uploads.
 * @returns {Promise<Object>} - A promise that resolves to the response data confirming the event was updated.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const editEvent = async (id, eventData) => {
  try {
    const response = await api.put(`event/${id}/edit`, eventData, {
      headers: { "Content-Type": "multipart/form-data" }, // for file upload
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Deletes multiple events by their IDs.
 *
 * @param {Array<string>} ids - An array of event IDs to delete.
 * @returns {Promise<Object>} - A promise that resolves to the response data confirming the deletion of the events.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const deleteEvents = async (ids) => {
  try {
    const response = await api.delete("event/delete", { data: { ids } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Fetches a list of event names based on the provided filters.
 *
 * @param {Object} [filters={}] - The filters to apply when retrieving the event names (e.g., status, type).
 * @returns {Promise<Object>} - A promise that resolves to the response data containing the list of event names.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const getEventNames = async (filters = {}) => {
  try {
    const response = await api.get(`event/get/names`, { params: filters });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
