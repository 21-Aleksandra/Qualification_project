import api from "./index";

export const getMissionList = async () => {
  try {
    const response = await api.get("mission/list");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const addMission = async (name) => {
  try {
    const response = await api.post("mission/add", { name });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
