import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../../index";
import { addSubsidiary, editSubsidiary } from "../../api/SubsidiaryAPI";
import OrganizationSection from "../../features/SubsidiaryEditForm/OrganizationSection";
import AddressSection from "../../features/AddressSection";
import { Form, Alert } from "react-bootstrap";
import CustomButton from "../../components/Common/CustomButton/CustomButton";
import { observer } from "mobx-react-lite";
import TextInputSection from "../../features/SubsidiaryEditForm/TextInputSection";
import PhotosSection from "../../features/PhotoSection";
import MissionSection from "../../features/SubsidiaryEditForm/MissionSection";
import { Spinner } from "react-bootstrap";
import useFetchSubsidiaryAddEditData from "../../hooks/useFetchSubsidiaryAddEditData";
import { SUBSIDIARIES_ROUTE } from "../../utils/routerConsts";
import "./AddEditSubsidiaryPage.css";

// A dynamic form for editing or adding event that determines its state by id presence
// For managers only
const AddEditSubsidiaryPage = observer(() => {
  const { mission, mainOrganization, address, user } = useContext(Context);
  const { id } = useParams();
  const managerId = user._id; // for assigning the author of the event
  const navigate = useNavigate();

  // Initial state for form data (used for addition)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    mainOrganizationId: "",
    foundedAt: "",
    addressId: "",
    email: "",
    website: "",
    staffCount: 0,
    missions: [],
    bannerPhoto: null,
    otherPhotos: [],
    otherPhotosPreviews: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch data if we are editing an existing subsidiary
  const {
    loading: fetchLoading,
    error: fetchError,
    subsidiaryData,
  } = useFetchSubsidiaryAddEditData(id, mission, mainOrganization, address);

  useEffect(() => {
    if (fetchLoading !== undefined) {
      setLoading(fetchLoading);
    }
    if (fetchError) {
      setError(fetchError);
    }
    if (subsidiaryData) {
      setFormData({
        // If subsidiary data exists, populate form fields for editing so user sees what he is editing
        // Some field are optional so they are set to empty strings if absent
        name: subsidiaryData.name || "",
        description: subsidiaryData.description || "",
        mainOrganizationId: subsidiaryData.mainOrganizationId || "",
        foundedAt: subsidiaryData.foundedAt || "",
        addressId: subsidiaryData.addressId || "",
        email: subsidiaryData.email || "",
        website: subsidiaryData.website || "",
        staffCount: subsidiaryData.staffCount || 0,
        missions: subsidiaryData.Missions?.map((m) => m.id) || [],
        bannerPhoto: subsidiaryData.bannerPhoto,
        otherPhotos: subsidiaryData.otherPhotos,
        otherPhotosPreviews: subsidiaryData.otherPhotosPreviews,
      });
      setIsEditing(true);
    }
  }, [fetchLoading, fetchError, setError, setLoading, subsidiaryData]); // Re-run the effect if fetch state or subsidiary data changes

  const handleFileChange = (e, fieldName) => {
    const files = e.target.files;
    const newFiles = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    //We update the otherPhotos array by adding the newly selected files (newFiles)
    //We also update the otherPhotosPreviews array, which holds the preview URLs, so that the preview images can be displayed in the UI.
    if (fieldName === "otherPhotos") {
      setFormData((prevState) => ({
        ...prevState,
        otherPhotos: [...prevState.otherPhotos, ...newFiles],
        otherPhotosPreviews: [
          ...prevState.otherPhotosPreviews,
          ...newFiles.map((f) => f.preview), // Append preview URLs for displaying images
        ],
      }));
    } else if (fieldName === "bannerPhoto") {
      setFormData((prevState) => ({
        ...prevState,
        bannerPhoto: files[0],
      }));
    }
  };

  // Function to visually remove a selected photo from the form
  //After modifying these arrays, the updated state is returned,
  //  causing the component to re-render with the updated list of photos and previews.
  const handleRemovePhoto = (index) => {
    setFormData((prevState) => {
      const updatedPhotos = [...prevState.otherPhotos];
      const updatedPreviews = [...prevState.otherPhotosPreviews];
      updatedPhotos.splice(index, 1);
      updatedPreviews.splice(index, 1);
      return {
        ...prevState,
        otherPhotos: updatedPhotos,
        otherPhotosPreviews: updatedPreviews,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const submitData = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      if (key === "otherPhotos") {
        value.forEach(({ file }) => submitData.append("otherPhotos", file));
      } else if (key === "bannerPhoto" && value) {
        submitData.append("bannerPhoto", value);
      } else if (Array.isArray(value)) {
        value.forEach((item) => submitData.append(key, item));
      } else if (value) {
        submitData.append(key, value);
      }
    }

    if (!id) {
      submitData.append("managerId", managerId); // appending author for newly created events
    }

    try {
      if (isEditing) {
        await editSubsidiary(id, submitData);
      } else {
        await addSubsidiary(submitData);
      }
      navigate(SUBSIDIARIES_ROUTE);
    } catch (err) {
      setError(err?.message || "Failed to submit the form: Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div id="subsidiary-loading" className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mt-3 subsidiary-form-container-special">
      <h2>{isEditing ? "Edit Subsidiary" : "Add Subsidiary"}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <TextInputSection formData={formData} handleChange={handleChange} />

        <OrganizationSection
          formData={formData}
          setFormData={setFormData}
          mainOrganization={mainOrganization}
        />

        <Form.Group controlId="foundedAt">
          <Form.Label>Founded At</Form.Label>
          <Form.Control
            type="date"
            name="foundedAt"
            value={formData.foundedAt ? formData.foundedAt.slice(0, 10) : ""}
            onChange={handleChange}
          />
        </Form.Group>

        <AddressSection
          formData={formData}
          setFormData={setFormData}
          address={address}
        />

        <Form.Group controlId="staffCount">
          <Form.Label>Staff Count</Form.Label>
          <Form.Control
            type="number"
            name="staffCount"
            value={formData.staffCount}
            onChange={handleChange}
          />
        </Form.Group>

        <PhotosSection
          formData={formData}
          handleFileChange={handleFileChange}
          handleRemovePhoto={handleRemovePhoto}
          setFormData={setFormData}
        />

        <MissionSection
          formData={formData}
          setFormData={setFormData}
          missionStore={mission}
        />

        <CustomButton
          type="submit"
          disabled={loading}
          className="custom-button-primary"
        >
          {isEditing ? "Update" : "Add"} Subsidiary
        </CustomButton>
      </Form>
    </div>
  );
});

export default AddEditSubsidiaryPage;
