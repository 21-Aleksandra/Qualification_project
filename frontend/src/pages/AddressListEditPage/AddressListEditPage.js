import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOneAddress, editAddress } from "../../api/AddressAPI";
import { Form, Alert, Spinner } from "react-bootstrap";
import CustomButton from "../../components/Common/CustomButton/CustomButton";
import { HELPER_TABLE_ADDRESS_ROUTE } from "../../utils/routerConsts";
import "./AddressListEditPage.css";

const AddressListEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    country: "",
    city: "",
    street: "",
    lat: "",
    lng: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      setLoading(true);
      setIsEditing(true);
      getOneAddress(id)
        .then((data) => {
          setFormData({
            country: data.country || "",
            city: data.city || "",
            street: data.street || "",
            lat: data.lat || "",
            lng: data.lng || "",
          });
        })
        .catch((err) => {
          const errorMessage =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch address details.";
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
      await editAddress(id, formData);
      navigate(HELPER_TABLE_ADDRESS_ROUTE);
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
    <div className="container mt-3 address-form-container">
      <h2>{isEditing ? `Edit Address` : `Add Address`}</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
          <p>Loading...</p>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="street">
            <Form.Label>Street</Form.Label>
            <Form.Control
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="lat">
            <Form.Label>Latitude</Form.Label>
            <Form.Control
              type="text"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="lng">
            <Form.Label>Longitude</Form.Label>
            <Form.Control
              type="text"
              name="lng"
              value={formData.lng}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <CustomButton
            type="submit"
            disabled={loading}
            className="custom-button-primary"
          >
            {isEditing ? "Update Address" : "Add Address"}
          </CustomButton>
        </Form>
      )}
    </div>
  );
};

export default AddressListEditPage;
