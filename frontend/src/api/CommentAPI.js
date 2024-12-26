import api from "./index";

/**
 * Fetches the list of comments for all event by event ID.
 *
 * @param {string} eventId - The ID of the event for which to fetch comments.
 * @returns {Promise<Object>} - A promise that resolves to the response data containing the event comments.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const getEventComments = async (eventId) => {
  try {
    const response = await api.get(`/comment/event-comments/${eventId}/get`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Adds a comment to a specific event.
 *
 * @param {Object} params - The comment details.
 * @param {string} params.eventId - The ID of the event to which the comment belongs.
 * @param {string} params.text - The content of the comment.
 * @param {number} params.rating - The rating associated with the comment (if applicable).
 * @param {string} params.userId - The ID of the user adding the comment.
 * @returns {Promise<Object>} - A promise that resolves to the response data confirming the comment was added.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const addEventComment = async ({ eventId, text, rating, userId }) => {
  try {
    const response = await api.post(`/comment/event-comments/${eventId}/add`, {
      text,
      rating,
      userId,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Fetches the list of comments for a specific news article by news ID.
 *
 * @param {string} newsId - The ID of the news article for which to fetch comments.
 * @returns {Promise<Object>} - A promise that resolves to the response data containing the news comments.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const getNewsComments = async (newsId) => {
  try {
    const response = await api.get(`/comment/news-comments/${newsId}/get`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Adds a comment to a specific news article.
 *
 * @param {Object} params - The comment details.
 * @param {string} params.newsId - The ID of the news article to which the comment belongs.
 * @param {string} params.text - The content of the comment.
 * @param {number} params.rating - The rating associated with the comment (if applicable).
 * @param {string} params.userId - The ID of the user adding the comment.
 * @returns {Promise<Object>} - A promise that resolves to the response data confirming the comment was added.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const addNewsComment = async ({ newsId, text, rating, userId }) => {
  try {
    const response = await api.post(`/comment/news-comments/${newsId}/add`, {
      text,
      rating,
      userId,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Fetches the list of comments for a specific subsidiary by subsidiary ID.
 *
 * @param {string} subsidiaryId - The ID of the subsidiary for which to fetch comments.
 * @returns {Promise<Object>} - A promise that resolves to the response data containing the subsidiary comments.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const getSubsidiaryComments = async (subsidiaryId) => {
  try {
    const response = await api.get(
      `/comment/subsidiary-comments/${subsidiaryId}/get`
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Adds a comment to a specific subsidiary.
 *
 * @param {Object} params - The comment details.
 * @param {string} params.subsidiaryId - The ID of the subsidiary to which the comment belongs.
 * @param {string} params.text - The content of the comment.
 * @param {number} params.rating - The rating associated with the comment (if applicable).
 * @param {string} params.userId - The ID of the user adding the comment.
 * @returns {Promise<Object>} - A promise that resolves to the response data confirming the comment was added.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const addSubsidiaryComment = async ({
  subsidiaryId,
  text,
  rating,
  userId,
}) => {
  try {
    const response = await api.post(
      `/comment/subsidiary-comments/${subsidiaryId}/add`,
      {
        text,
        rating,
        userId,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Fetches all comments based on the provided filters.
 *
 * @param {Object} filters - The filters used to retrieve the comments (e.g., author name, text).
 * @returns {Promise<Object>} - A promise that resolves to the response data containing the filtered comments.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const getAllComments = async (filters = {}) => {
  try {
    const response = await api.get(`/comment/get`, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Deletes comments with the specified IDs.
 *
 * @param {Array<string>} ids - An array of comment IDs to be deleted.
 * @returns {Promise<Object>} - A promise that resolves to the response data confirming the deletion.
 * @throws {Error} - Throws an error if the request fails. The error contains the response data or the error message.
 */
export const deleteComments = async (ids) => {
  try {
    const response = await api.delete(`/comment/delete`, { data: { ids } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
