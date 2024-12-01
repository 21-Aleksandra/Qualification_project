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
