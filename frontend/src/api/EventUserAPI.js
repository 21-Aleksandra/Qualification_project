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
    const response = await api.delete("event-user/unregister", {
      data: { eventId, userId },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const listUserEvents = async (userId, filters = {}) => {
  try {
    const response = await api.get(`event-user/list/${userId}`, {
      params: filters, // Filters object is optional
    });
    console.log(filters);
    return response.data.events;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
