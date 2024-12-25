import api from "./index";

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

export const addMainOrganization = async (name) => {
  try {
    const response = await api.post("main-organization/add", { name });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getOneMainOrganization = async (id) => {
  try {
    const response = await api.get(`main-organization/${id}/get`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const editMainOrganization = async (id, updateData) => {
  try {
    const response = await api.put(`main-organization/${id}/edit`, updateData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
