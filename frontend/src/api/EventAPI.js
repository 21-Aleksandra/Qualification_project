import api from "./index";

export const getEventFilteredList = async (filters = {}) => {
  try {
    const response = await api.get("event/list", { params: filters });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

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

export const addEvent = async (eventData) => {
  try {
    const response = await api.post("event/add", eventData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const editEvent = async (id, eventData) => {
  try {
    const response = await api.put(`event/${id}/edit`, eventData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteEvents = async (ids) => {
  try {
    const response = await api.delete("event/delete", { data: { ids } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
