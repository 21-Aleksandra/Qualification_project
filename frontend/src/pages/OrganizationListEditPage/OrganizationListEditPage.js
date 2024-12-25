import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOneMainOrganization,
  editMainOrganization,
} from "../../api/MainOrganizationAPI";
import { Form, Alert, Spinner } from "react-bootstrap";
import CustomButton from "../../components/Common/CustomButton/CustomButton";
import { HELPER_TABLE_ORGANIZATION_ROUTE } from "../../utils/routerConsts";
import "./OrganizationListEditPage.css";

const OrganizationListEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      setLoading(true);
      setIsEditing(true);
      getOneMainOrganization(id)
        .then((data) => {
          setFormData({
            name: data.name || "",
            address: data.address || "",
          });
        })
        .catch((err) => {
          const errorMessage =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch organization details.";
          setError(errorMessage);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

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
      await editMainOrganization(id, formData);
      navigate(HELPER_TABLE_ORGANIZATION_ROUTE);
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
    <div className="container mt-3 organization-form-container">
      <h2>{isEditing ? `Edit Organization` : `Add Organization`}</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
          <p>Loading...</p>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Organization Name</Form.Label>
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
            {isEditing ? "Update Organization" : "Add Organization"}
          </CustomButton>
        </Form>
      )}
    </div>
  );
};

export default OrganizationListEditPage;
