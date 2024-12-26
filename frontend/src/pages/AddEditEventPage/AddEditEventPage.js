import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../../index";
import { addEvent, editEvent } from "../../api/EventAPI";
import EventTypeSection from "../../features/EventEditForm/EventTypeSection";
import AddressSection from "../../features/AddressSection";
import DatesSection from "../../features/EventEditForm/DatesSection";
import SubsidiaryNameSection from "../../features/EventEditForm/SubsidiarySection";
import { Form, Alert } from "react-bootstrap";
import CustomButton from "../../components/Common/CustomButton/CustomButton";
import TextSection from "../../features/EventEditForm/TextSection";
import { observer } from "mobx-react-lite";
import PhotosSection from "../../features/PhotoSection";
import { Spinner } from "react-bootstrap";
import useFetchEventData from "../../hooks/useFetchEventData";
import { EVENTS_ROUTE } from "../../utils/routerConsts";
import "./AddEditEventPage.css";

// A dynamic form page for adding or editing signle event based on id presence
// Includes both numeric, text and file input for photos and requires several api requests for fetching needed dropdown data
// For managers only
const AddEditEventPage = observer(() => {
  const { eventType, subsidiary, address, user } = useContext(Context);
  const { id } = useParams();
  const managerId = user.id; // Manager's user ID to associate with the event
  const navigate = useNavigate();

  // initial form state that is changed if form is for edit
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    typeId: "",
    dateFrom: "",
    dateTo: "",
    publishOn: "",
    applicationDeadline: "",
    addressId: "",
    subsidiaryId: "",
    maxPeopleAllowed: 0,
    bannerPhoto: null,
    otherPhotos: [],
    otherPhotosPreviews: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetching event data using custom hook
  const {
    loading: fetchLoading,
    error: fetchError,
    eventData,
  } = useFetchEventData(id, eventType, subsidiary, user, address);

  // Effect hook to handle state updates based on fetched event data or errors
  useEffect(() => {
    if (fetchLoading !== undefined) {
      setLoading(fetchLoading); // Update loading state when fetch status changes
    }
    if (fetchError) {
      setError(fetchError); // Capture and display any errors from the fetch operation
    }
    if (eventData) {
      // Populate formData with the fetched event data if in edit mode
      setFormData({
        name: eventData.name || "",
        description: eventData.description || "",
        typeId: eventData.typeId || "",
        dateFrom: eventData.dateFrom || "",
        dateTo: eventData.dateTo || "",
        publishOn: eventData.publishOn || "",
        applicationDeadline: eventData.applicationDeadline || "",
        addressId: eventData.addressId || "",
        subsidiaryId: eventData.subsidiaryId || "",
        maxPeopleAllowed: eventData.maxPeopleAllowed || 0,
        bannerPhoto: eventData.bannerPhoto,
        otherPhotos: eventData.otherPhotos,
        otherPhotosPreviews: eventData.otherPhotosPreviews,
      });
      setIsEditing(true);
    }
  }, [fetchLoading, fetchError, eventData]);

  const handleFileChange = (e, fieldName) => {
    const files = e.target.files; // Get the selected files from the file input
    const newFiles = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file), // Generate a preview URL for image files
    }));

    //We update the otherPhotos array by adding the newly selected files (newFiles)
    //We also update the otherPhotosPreviews array, which holds the preview URLs, so that the preview images can be displayed in the UI.
    if (fieldName === "otherPhotos") {
      setFormData((prevState) => ({
        ...prevState,
        otherPhotos: [...prevState.otherPhotos, ...newFiles],
        otherPhotosPreviews: [
          ...prevState.otherPhotosPreviews,
          ...newFiles.map((f) => f.preview),
        ],
      }));
      //If the fieldName is "bannerPhoto", we update the bannerPhoto property
      // in formData with the first file selected.
      // The assumption here is that the banner photo can only be one file, so we take files[0]
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
      } else if (value) {
        submitData.append(key, value);
      }
    }

    if (!id) {
      submitData.append("managerId", managerId);
    }

    try {
      if (isEditing) {
        await editEvent(id, submitData);
      } else {
        await addEvent(submitData);
      }
      navigate(EVENTS_ROUTE);
    } catch (err) {
      setError(err?.message || "Failed to submit the form:Please try again.");
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

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const utcDate = new Date(value).toISOString();

    setFormData((prev) => ({
      ...prev,
      [name]: utcDate,
    }));
  };

  if (loading) {
    return (
      <div id="event-loading" className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mt-3 event-form-container">
      <h2>{isEditing ? "Edit Event" : "Add Event"}</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <TextSection formData={formData} handleChange={handleChange} />

      <Form onSubmit={handleSubmit}>
        <EventTypeSection
          formData={formData}
          setFormData={setFormData}
          eventType={eventType}
        />

        <SubsidiaryNameSection
          formData={formData}
          setFormData={setFormData}
          subsidiary={subsidiary}
        />

        <DatesSection formData={formData} handleDateChange={handleDateChange} />

        <AddressSection
          formData={formData}
          setFormData={setFormData}
          address={address}
        />

        <Form.Group controlId="maxPeopleAllowed">
          <Form.Label>Max People Allowed</Form.Label>
          <Form.Control
            type="number"
            name="maxPeopleAllowed"
            value={formData.maxPeopleAllowed}
            onChange={handleChange}
          />
        </Form.Group>

        <PhotosSection
          formData={formData}
          handleFileChange={handleFileChange}
          handleRemovePhoto={handleRemovePhoto}
          setFormData={setFormData}
        />

        <CustomButton
          type="submit"
          disabled={loading}
          className="custom-button-primary"
        >
          {isEditing ? "Update" : "Add"} Event
        </CustomButton>
      </Form>
    </div>
  );
});

export default AddEditEventPage;
