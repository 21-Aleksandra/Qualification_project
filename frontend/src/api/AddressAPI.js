import api from "./index";

export const getSubsidiaryAddressList = async (filters = {}) => {
  try {
    const response = await api.get("address/list-subsidiary", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const addAddress = async (country, city, street) => {
  try {
    const response = await api.post("address/add", {
      country,
      city,
      street,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
