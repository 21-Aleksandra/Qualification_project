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

const AddEditEventPage = observer(() => {
  const { eventType, subsidiary, address, user } = useContext(Context);
  const { id } = useParams();
  const managerId = user.id;
  const navigate = useNavigate();

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

  const {
    loading: fetchLoading,
    error: fetchError,
    eventData,
  } = useFetchEventData(id, eventType, subsidiary, user, address);

  useEffect(() => {
    if (fetchLoading !== undefined) {
      setLoading(fetchLoading);
    }
    if (fetchError) {
      setError(fetchError);
    }
    if (eventData) {
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
    const files = e.target.files;
    const newFiles = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    if (fieldName === "otherPhotos") {
      setFormData((prevState) => ({
        ...prevState,
        otherPhotos: [...prevState.otherPhotos, ...newFiles],
        otherPhotosPreviews: [
          ...prevState.otherPhotosPreviews,
          ...newFiles.map((f) => f.preview),
        ],
      }));
    } else if (fieldName === "bannerPhoto") {
      setFormData((prevState) => ({
        ...prevState,
        bannerPhoto: files[0],
      }));
    }
  };

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
      setError(
        "Failed to submit the form: " + err.message + ". Please try again."
      );
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
