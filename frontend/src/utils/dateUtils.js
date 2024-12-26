/**
 * Formats a given date string into a localized date and time string.
 *
 * @param {string} dateString - The date string to be formatted.
 * @returns {string} A localized string representing the formatted date and time, or "Unknown" if no date is provided.
 *
 * @example
 * formatDateTime("2024-12-25T15:30:00Z"); // Returns: "12/25/2024, 15:30"
 * formatDateTime(""); // Returns: "Unknown"
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
