import api from "./index";

/**
 * Retrieves the summary of achievements statistics.
 * e.g total count of users, events, subsidiaries along with titles
 *
 * @async
 * @function getAchievementSummary
 * @returns {Promise<Object>} The response data containing the achievements summary.
 * @throws {Error} An error message or response data if the request fails.
 */
export const getAchievementSummary = async () => {
  try {
    const response = await api.get("statistics/achievements");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
