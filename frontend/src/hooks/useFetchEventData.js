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

          const otherPhotos = await Promise.all(
            eventResponse.Photo_Set.Photos.filter(
              (photo) => !photo.isBannerPhoto
            ).map(async (photo) => {
              const photoUrl =
                `${process.env.REACT_APP_SERVER_URL}/${photo.url}`.replace(
                  /([^:]\/)\/+/g,
                  "$1"
                );
              const file = await fetchFileFromURL(photoUrl);
              return {
                file,
                preview: photoUrl,
              };
            })
          );

          setEventData({
            ...eventResponse,
            bannerPhoto: bannerPhotoFile,
            otherPhotos,
            otherPhotosPreviews: otherPhotos.map((p) => p.preview),
          });
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { loading, error, eventData };
};

export default useFetchEventData;
