import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOneEventType, editEventType } from "../../api/EventTypeAPI";
import { Form, Alert, Spinner } from "react-bootstrap";
import CustomButton from "../../components/Common/CustomButton/CustomButton";
import { HELPER_TABLE_EVENTTYPE_ROUTE } from "../../utils/routerConsts";
import "./EventTypeListEditPage.css";

// A page with form for editing one event type name. For admin only.
const EventTypeListEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", // name is only input we can have
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch the event type details if we are editing e.g. having id
  useEffect(() => {
    if (id) {
      setLoading(true);
      setIsEditing(true);
      getOneEventType(id)
        .then((data) => {
          setFormData({
            name: data.name || "", // Set the name of the event type if fetched
          });
        })
        .catch((err) => {
          const errorMessage =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch event type details.";
          setError(errorMessage);
        })
        .finally(() => setLoading(false));
    }
  }, [id]); // Depend on the id to re-run the effect if the id changes

  // Handle input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await editEventType(id, formData);
      navigate(HELPER_TABLE_EVENTTYPE_ROUTE);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit the form. Please try again.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-3 event-type-form-container">
      <h2>{isEditing ? `Edit Event Type` : `Add Event Type`}</h2>
      {/* Show error if it exists */}
      {error && <Alert variant="danger">{error}</Alert>}{" "}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
          <p>Loading...</p>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Event Type Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <CustomButton
            type="submit"
            disabled={loading}
            className="custom-button-primary"
          >
            {isEditing ? "Update Event Type" : "Add Event Type"}
          </CustomButton>
        </Form>
      )}
    </div>
  );
};

export default EventTypeListEditPage;
