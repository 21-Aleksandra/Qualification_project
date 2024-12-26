/**
 * Fetches a file from a given URL, normalizes the URL, and returns it as a File object.
 *
 * @param {string} url - The URL from which to fetch the file.
 * @returns {Promise<File>} A Promise that resolves to a File object containing the file from the URL.
 *
 */

export const fetchFileFromURL = async (url) => {
  const normalizedUrl = url.replace(/([^:]\/)\/+/g, "$1");
  const response = await fetch(normalizedUrl);
  const blob = await response.blob(); // Convert the response to binary data
  const fileName = normalizedUrl.split("/").pop();
  return new File([blob], fileName, { type: blob.type });
};
