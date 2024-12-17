import api from "./index";

export const getAchievementSummary = async () => {
  try {
    const response = await api.get("statistics/achievements");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
