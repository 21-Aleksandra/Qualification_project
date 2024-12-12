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

export const getEventAddresses = async (filters = {}) => {
  try {
    const response = await api.get("address/list-event", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getAllAddressList = async () => {
  try {
    const response = await api.get("address/list-all");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const addAddress = async (country, city, street, lat, lng) => {
  try {
    const response = await api.post("address/add", {
      country,
      city,
      street,
      lat,
      lng,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
