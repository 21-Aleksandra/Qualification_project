import { useState, useEffect, useCallback } from "react";
import { getMissionList } from "../api/MissionAPI";
import { getMainOrganizationList } from "../api/MainOrganizationAPI";
import { getAllAddressList } from "../api/AddressAPI";
import { getSubsidiaryById } from "../api/SubsidiaryAPI";
import { fetchFileFromURL } from "../utils/fileUtils";

const useFetchSubsidiaryData = (id, missionStore, orgStore, addressStore) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subsidiaryData, setSubsidiaryData] = useState(null);

  // useCallback ensures the fetchData function is memoized and doesn't get recreated on every render.
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const missionResponse = await getMissionList();
      missionStore.setMissions(missionResponse?.missions || []);

      const orgResponse = await getMainOrganizationList();
      orgStore.setOrganizations(orgResponse?.organizations || []);

      const addressResponse = await getAllAddressList();
      addressStore.setAddresses(addressResponse || []);

      // If an `id` is provided (i.e., editing an existing subsidiary), fetch the subsidiary details.
      if (id) {
        const subsidiaryResponse = await getSubsidiaryById(id);
        if (subsidiaryResponse) {
          const bannerPhotoFile = subsidiaryResponse.Photo_Set.Photos.find(
            (photo) => photo.isBannerPhoto
          )
            ? await fetchFileFromURL(
                `${process.env.REACT_APP_SERVER_URL}/${
                  subsidiaryResponse.Photo_Set.Photos.find(
                    (photo) => photo.isBannerPhoto
                  ).url
                }`
              )
            : null;

          // Fetch other photos (those that are not the banner photo), and create file previews for them.
          const otherPhotos = await Promise.all(
            subsidiaryResponse.Photo_Set.Photos.filter(
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
                preview: photoUrl,
              };
            })
          );

          setSubsidiaryData({
            ...subsidiaryResponse,
            bannerPhoto: bannerPhotoFile,
            otherPhotos,
            otherPhotosPreviews: otherPhotos.map((p) => p.preview), // Extract the preview URLs for displaying in the UI.
          });
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id, missionStore, orgStore, addressStore]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Only re-run fetchData if the fetchData callback changes (which depends on the dependencies above).

  return { loading, error, subsidiaryData };
};

export default useFetchSubsidiaryData;
