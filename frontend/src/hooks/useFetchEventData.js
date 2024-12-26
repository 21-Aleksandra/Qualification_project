import { useState, useEffect, useCallback } from "react";
import { getEventById } from "../api/EventAPI";
import { getAllAddressList } from "../api/AddressAPI";
import { getEventTypeList } from "../api/EventTypeAPI";
import { getSubsidiaryNames } from "../api/SubsidiaryAPI";
import { fetchFileFromURL } from "../utils/fileUtils";

const useFetchEventData = (
  id,
  eventTypeStore,
  subsidiaryStore,
  userStore,
  addressStore
) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [eventData, setEventData] = useState(null);

  // useCallback ensures that this function is memoized and only recreated when dependencies change.
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const addressResponse = await getAllAddressList();
      addressStore.setAddresses(addressResponse || []);

      const eventTypeResponse = await getEventTypeList();
      eventTypeStore.setEventTypes(eventTypeResponse || []);

      const subsidiaryResponse = await getSubsidiaryNames({
        userId: userStore.id,
        userRoles: userStore.roles.join(","),
      });
      console.log(subsidiaryResponse);
      subsidiaryStore.setNames(subsidiaryResponse || []);

      // If an `id` is provided (i.e., editing an existing event), fetch the event details.
      if (id) {
        const eventResponse = await getEventById(
          id,
          userStore.id,
          userStore.roles
        );
        if (eventResponse) {
          const bannerPhotoFile = eventResponse.Photo_Set.Photos.find(
            (photo) => photo.isBannerPhoto
          )
            ? await fetchFileFromURL(
                `${process.env.REACT_APP_SERVER_URL}/${
                  eventResponse.Photo_Set.Photos.find(
                    (photo) => photo.isBannerPhoto
                  ).url
                }`
              )
            : null;

          // Fetch other photos (those that are not the banner photo), and create file previews for them.
          const otherPhotos = await Promise.all(
            eventResponse.Photo_Set.Photos.filter(
              (photo) => !photo.isBannerPhoto
            ).map(async (photo) => {
              const photoUrl =
                `${process.env.REACT_APP_SERVER_URL}/${photo.url}`.replace(
                  /([^:]\/)\/+/g,
                  "$1"
                ); // Normalize the URL to avoid double slashes
              const file = await fetchFileFromURL(photoUrl);
              return {
                file,
                preview: photoUrl, // The URL that can be used as a preview image.
              };
            })
          );

          setEventData({
            ...eventResponse,
            bannerPhoto: bannerPhotoFile,
            otherPhotos,
            otherPhotosPreviews: otherPhotos.map((p) => p.preview), // Extract the preview URLs for displaying in the UI.
          });
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    id,
    addressStore,
    eventTypeStore,
    subsidiaryStore,
    userStore.id,
    userStore.roles,
  ]);
  // useEffect hook to invoke the fetchData function when the component is mounted or dependencies change.
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Only re-run fetchData if the fetchData callback changes (which depends on the dependencies above).

  return { loading, error, eventData };
};

export default useFetchEventData;
