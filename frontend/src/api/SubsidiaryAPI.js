import api from "./index";

export const getSubsidiaryFilteredList = async (filters = {}) => {
  try {
    const response = await api.get("subsidiary/list", { params: filters });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getSubsidiaryById = async (id, userId, userRole) => {
  try {
    const response = await api.get(`subsidiary/${id}`, {
      params: { userId, userRole },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const addSubsidiary = async (subsidiaryData) => {
  try {
    const response = await api.post("subsidiary/add", subsidiaryData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const editSubsidiary = async (id, subsidiaryData) => {
  try {
    const response = await api.put(`subsidiary/${id}/edit`, subsidiaryData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteSubsidiaries = async (ids) => {
  try {
    const response = await api.delete("subsidiary/delete", { data: { ids } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
