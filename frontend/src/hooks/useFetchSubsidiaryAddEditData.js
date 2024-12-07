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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const missionResponse = await getMissionList();
      missionStore.setMissions(missionResponse?.missions || []);

      const orgResponse = await getMainOrganizationList();
      orgStore.setOrganizations(orgResponse?.organizations || []);

      const addressResponse = await getAllAddressList();
      addressStore.setAddresses(addressResponse || []);

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

          const otherPhotos = await Promise.all(
            subsidiaryResponse.Photo_Set.Photos.filter(
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

          setSubsidiaryData({
            ...subsidiaryResponse,
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
  }, [id, missionStore, orgStore, addressStore]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { loading, error, subsidiaryData };
};

export default useFetchSubsidiaryData;
