import api from "./index";

/**
 * Registers a user to an event.
 *
 * @param {string} eventId - The ID of the event the user wants to register for.
 * @param {string} userId - The ID of the user registering for the event.
 * @returns {Promise<Object>} - A promise that resolves to the response data confirming the user registration.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const registerUserToEvent = async (eventId, userId) => {
  try {
    const response = await api.post("event-user/register", { eventId, userId });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Unregisters a user from an event.
 *
 * @param {string} eventId - The ID of the event the user wants to unregister from.
 * @param {string} userId - The ID of the user unregistering from the event.
 * @returns {Promise<Object>} - A promise that resolves to the response data confirming the user unregistration.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const unregisterUserFromEvent = async (eventId, userId) => {
  try {
    const response = await api.delete("event-user/unregister", {
      data: { eventId, userId },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Lists all events a specific user is registered for.
 *
 * @param {string} userId - The ID of the user whose events are being retrieved.
 * @param {Object} [filters={}] - Optional filters to refine the event list (e.g., event type, date range).
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of events the user is registered for.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const listUserEvents = async (userId, filters = {}) => {
  try {
    const response = await api.get(`event-user/list/${userId}`, {
      params: filters, // Filters object is optional
    });
    return response.data.events;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
