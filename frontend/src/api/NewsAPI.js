import api from "./index";

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

export const getOneSubsidiaryNews = async (id) => {
  try {
    const response = await api.get(`news/subsidiary-news/${id}/get`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

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

export const getEventNews = async (filters = {}) => {
  try {
    const response = await api.get("news/event-news/get", { params: filters });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getOneEventNews = async (id) => {
  try {
    const response = await api.get(`news/event-news/${id}/get`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

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

export const getTopFiveNews = async () => {
  try {
    const response = await api.get("news/top-5/get");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteNews = async (ids) => {
  try {
    const response = await api.delete("news/delete", { data: { ids } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
