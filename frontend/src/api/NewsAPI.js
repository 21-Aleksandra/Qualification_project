import api from "./index";

/**
 * Fetches subsidiary-related news based on the provided filters.
 *
 * @async
 * @function getSubsidiaryNews
 * @param {Object} [filters={}] - Optional filters to apply to the request.
 * @returns {Promise<Object>} The response data containing subsidiary news.
 * @throws {Error} An error message or response data if the request fails.
 */
export const getSubsidiaryNews = async (filters = {}) => {
  try {
    const response = await api.get("news/subsidiary-news/get", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Fetches a single subsidiary news item by its ID.
 *
 * @async
 * @function getOneSubsidiaryNews
 * @param {string} id - The unique identifier of the subsidiary news item.
 * @returns {Promise<Object>} The response data containing the news details.
 * @throws {Error} An error message or response data if the request fails.
 */
export const getOneSubsidiaryNews = async (id) => {
  try {
    const response = await api.get(`news/subsidiary-news/${id}/get`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Adds new subsidiary news.
 *
 * @async
 * @function addSubsidiaryNews
 * @param {Object} newsData - The news details to be added.
 * @param {string} newsData.subsidiaryId - The ID of the subsidiary.
 * @param {string} newsData.title - The title of the news.
 * @param {string} newsData.content - The content of the news.
 * @param {string} newsData.authorId - The ID of the author of news.
 * @returns {Promise<Object>} The response data confirming the addition.
 * @throws {Error} An error message or response data if the request fails.
 */
export const addSubsidiaryNews = async ({
  subsidiaryId,
  title,
  content,
  authorId,
}) => {
  try {
    const response = await api.post("news/subsidiary-news/add", {
      subsidiaryId,
      title,
      content,
      authorId,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Edits an existing subsidiary news item.
 *
 * @async
 * @function editSubsidiaryNews
 * @param {string} id - The unique identifier of the news item to edit.
 * @param {Object} updateData - The updated data for the news.
 * @param {string} updateData.subsidiaryId - The ID of the subsidiary.
 * @param {string} updateData.title - The updated title of the news.
 * @param {string} updateData.content - The updated content of the news.
 * @returns {Promise<Object>} The response data confirming the edit.
 * @throws {Error} An error message or response data if the request fails.
 */
export const editSubsidiaryNews = async (
  id,
  { subsidiaryId, title, content }
) => {
  try {
    const response = await api.put(`news/subsidiary-news/${id}/edit`, {
      subsidiaryId,
      title,
      content,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Fetches event-related news based on the provided filters.
 *
 * @async
 * @function getEventNews
 * @param {Object} [filters={}] - Optional filters to apply to the request.
 * @returns {Promise<Object>} The response data containing event news.
 * @throws {Error} An error message or response data if the request fails.
 */
export const getEventNews = async (filters = {}) => {
  try {
    const response = await api.get("news/event-news/get", { params: filters });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Fetches a single event news item by its ID.
 *
 * @async
 * @function getOneEventNews
 * @param {string} id - The unique identifier of the event news item.
 * @returns {Promise<Object>} The response data containing the news details.
 * @throws {Error} An error message or response data if the request fails.
 */
export const getOneEventNews = async (id) => {
  try {
    const response = await api.get(`news/event-news/${id}/get`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Adds new event news.
 *
 * @async
 * @function addEventNews
 * @param {Object} newsData - The news details to be added.
 * @param {string} newsData.eventId - The ID of the event.
 * @param {string} newsData.title - The title of the news.
 * @param {string} newsData.content - The content of the news.
 * @param {string} newsData.authorId - The ID of the author of news.
 * @returns {Promise<Object>} The response data confirming the addition.
 * @throws {Error} An error message or response data if the request fails.
 */
export const addEventNews = async ({ eventId, title, content, authorId }) => {
  try {
    const response = await api.post("news/event-news/add", {
      eventId,
      title,
      content,
      authorId,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Edits an existing event news item.
 *
 * @async
 * @function editEventNews
 * @param {string} id - The unique identifier of the news item to edit.
 * @param {Object} updateData - The updated data for the news.
 * @param {string} updateData.eventId - The ID of the event.
 * @param {string} updateData.title - The updated title of the news.
 * @param {string} updateData.content - The updated content of the news.
 * @returns {Promise<Object>} The response data confirming the edit.
 * @throws {Error} An error message or response data if the request fails.
 */
export const editEventNews = async (id, { eventId, title, content }) => {
  try {
    const response = await api.put(`news/event-news/${id}/edit`, {
      eventId,
      title,
      content,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Fetches the top 5 news items by addition date.
 *
 * @async
 * @function getTopFiveNews
 * @returns {Promise<Object>} The response data containing the top 5 news items.
 * @throws {Error} An error message or response data if the request fails.
 */
export const getTopFiveNews = async () => {
  try {
    const response = await api.get("news/top-5/get");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Deletes multiple news items by their IDs.
 *
 * @async
 * @function deleteNews
 * @param {string[]} ids - An array of unique identifiers of the news items to delete.
 * @returns {Promise<Object>} The response data confirming the deletion.
 * @throws {Error} An error message or response data if the request fails.
 */
export const deleteNews = async (ids) => {
  try {
    const response = await api.delete("news/delete", { data: { ids } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
