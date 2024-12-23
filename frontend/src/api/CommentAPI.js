import api from "./index";

export const getEventComments = async (eventId) => {
  try {
    const response = await api.get(`/comment/event-comments/${eventId}/get`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

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

export const getNewsComments = async (newsId) => {
  try {
    const response = await api.get(`/comment/news-comments/${newsId}/get`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

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

export const deleteComments = async (ids) => {
  try {
    const response = await api.delete(`/comment/delete`, { data: { ids } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
