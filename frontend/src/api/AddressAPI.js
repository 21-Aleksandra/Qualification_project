import api from "./index";

/**
 * Fetches a list of subsidiary addresses based on the provided filters(userRole, userId etc.).
 *
 * @param {Object} [filters={}] - An optional object containing filters to apply when fetching the subsidiary addresses.
 * @returns {Promise<Object>} - A promise that resolves to the response data, which contains a list of subsidiary addresses.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
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

/**
 * Fetches a list of event addresses based on the provided filters(userRole, userId etc.).
 *
 * @param {Object} [filters={}] - An optional object containing filters to apply when fetching the event addresses.
 * @returns {Promise<Object>} - A promise that resolves to the response data, which contains a list of event addresses.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
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

/**
 * Fetches a list of all addresses without any filters.
 *
 * @returns {Promise<Object>} - A promise that resolves to the response data, which contains a list of all addresses.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const getAllAddressList = async () => {
  try {
    const response = await api.get("address/list-all");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Adds a new address to the database.
 *
 * @param {string} country - The country for the new address.
 * @param {string} city - The city for the new address.
 * @param {string} street - The street for the new address.
 * @param {number} lat - The latitude of the new address.
 * @param {number} lng - The longitude of the new address.
 * @returns {Promise<Object>} - A promise that resolves to the response data, which contains the added address information.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
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

/**
 * Fetches details of a single address by its ID.
 *
 * @param {string} id - The unique identifier of the address to fetch.
 * @returns {Promise<Object>} - A promise that resolves to the response data, which contains the details of the requested address.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const getOneAddress = async (id) => {
  try {
    const response = await api.get(`/address/${id}/get`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Updates an address by its ID with the provided updated data(city, steet, lat etc.).
 *
 * @param {string} id - The unique identifier of the address to update.
 * @param {Object} updateData - An object containing the updated fields for the address.
 * @returns {Promise<Object>} - A promise that resolves to the response data, which contains the updated address information.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const editAddress = async (id, updateData) => {
  try {
    const response = await api.put(`/address/${id}/edit`, updateData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
