/**
 * Fetches latitude and longitude for a given address using the Google Maps Geocoding API.
 *
 * @param {string} address - The address for which to fetch the latitude and longitude.
 * @returns {Promise<Object|null>} - A Promise that resolves to an object containing `lat` and `lng` if successful, or `null` if there's an error or no results.
 */

export const fetchLatLng = async (address) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      console.error("Geocoding API error", data.status);
      return null;
    }
  } catch (err) {
    console.error("Error fetching geocoding data:", err);
    return null;
  }
};
