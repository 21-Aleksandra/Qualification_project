import axios from "axios";

/**
 * Creates an Axios instance configured for making API requests.
 *
 * @type {AxiosInstance}
 * @property {string} baseURL - The base URL for all API requests, derived from the `REACT_APP_API_URL` environment variable.
 * @property {Object} headers - Default headers for all requests:
 *    - `Content-Type: application/json` to indicate JSON data.
 * @property {boolean} withCredentials - Indicates whether or not cross-site Access-Control requests should be made using credentials.
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
