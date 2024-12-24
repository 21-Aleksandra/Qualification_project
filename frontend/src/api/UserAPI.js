import api from "./index";

export const getUsers = async (filters = {}) => {
  try {
    const response = await api.get("user/get", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getOneUser = async (id) => {
  try {
    const response = await api.get(`user/${id}/get`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const addUser = async ({
  username,
  password,
  email,
  roles,
  isVerified,
}) => {
  try {
    const response = await api.post("user/add", {
      username,
      password,
      email,
      roles,
      isVerified,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const editUser = async (
  id,
  { username, email, password, roles, isVerified }
) => {
  try {
    const response = await api.put(`user/${id}/edit`, {
      username,
      email,
      password,
      roles,
      isVerified,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteUsers = async (ids) => {
  try {
    const response = await api.delete("user/delete", { data: { ids } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
