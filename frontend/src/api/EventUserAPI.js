import api from "./index";

export const registerUserToEvent = async (eventId, userId) => {
  try {
    const response = await api.post("event-user/register", { eventId, userId });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const unregisterUserFromEvent = async (eventId, userId) => {
  try {
    const response = await api.post("event-user/unregister", {
      eventId,
      userId,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const listUserEvents = async (userId, filters = {}) => {
  try {
    const response = await api.get(`event-user/${userId}/list`, {
      params: filters,
    });
    return response.data.events;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
