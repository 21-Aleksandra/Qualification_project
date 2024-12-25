import api from "./index";

export const getEventTypeList = async (filters = {}) => {
  try {
    const response = await api.get("event-type/list", { params: filters });
    return response.data.eventTypes;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const addEventType = async (name) => {
  try {
    const response = await api.post("event-type/add", { name });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getOneEventType = async (id) => {
  try {
    const response = await api.get(`event-type/${id}/get`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const editEventType = async (id, updateData) => {
  try {
    const response = await api.put(`event-type/${id}/edit`, updateData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
