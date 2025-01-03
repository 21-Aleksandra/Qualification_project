import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOneMission, editMission } from "../../api/MissionAPI";
import { Form, Alert, Spinner } from "react-bootstrap";
import CustomButton from "../../components/Common/CustomButton/CustomButton";
import { HELPER_TABLE_MISSION_ROUTE } from "../../utils/routerConsts";
import "./MissionListEditPage.css";

// A form for editing the existing mission name
// For admins only
const MissionListEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch mission data if an ID is present (i.e., when editing an existing mission)
  useEffect(() => {
    if (id) {
      setLoading(true);
      setIsEditing(true);
      getOneMission(id)
        .then((data) => {
          // If the mission is found, populate the form fields with the existing mission data
          setFormData({
            name: data.name || "",
            description: data.description || "",
          });
        })
        .catch((err) => {
          const errorMessage =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch mission details.";
          setError(errorMessage);
        })
        .finally(() => setLoading(false));
    }
  }, [id]); // This useEffect runs whenever the mission ID changes (for editing).

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
      await editMission(id, formData);
      navigate(HELPER_TABLE_MISSION_ROUTE);
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
    <div className="container mt-3 mission-form-container">
      <h2>{isEditing ? `Edit Mission` : `Add Mission`}</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Show loading spinner while data is being fetched or form is being submitted */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
          <p>Loading...</p>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Mission Name</Form.Label>
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
            {isEditing ? "Update Mission" : "Add Mission"}
          </CustomButton>
        </Form>
      )}
    </div>
  );
};

export default MissionListEditPage;
