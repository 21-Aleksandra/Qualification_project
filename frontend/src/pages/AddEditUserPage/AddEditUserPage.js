import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addUser, editUser, getOneUser } from "../../api/UserAPI";
import UserRoles from "../../utils/roleConsts";
import { Form, Alert, Spinner } from "react-bootstrap";
import CustomButton from "../../components/Common/CustomButton/CustomButton";
import { USERS_ROUTE } from "../../utils/routerConsts";
import Select from "react-select";
import "./UserAddEditPage.css";

// A dynamic form for both ading and editing user, the id presence defines the form state
// For admin only
const AddEditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    roles: [], // since user potentially can have 1 to many roles in future
    isVerified: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create options for the roles from UserRoles constants
  const roleOptions = Object.entries(UserRoles).map(([roleName, roleId]) => ({
    value: roleId,
    label: roleName,
  }));

  // Fetch user data if editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      setIsEditing(true);

      getOneUser(id)
        .then((data) => {
          setFormData({
            // set form data so user knows what to edit and what is current state
            username: data.username,
            email: data.email,
            password: "", // Passwords are not fetched for security reasons
            roles: data.Roles.map((role) => ({
              value: role.id,
              label: role.rolename,
            })),
            isVerified: data.isVerified,
          });
        })
        .catch((err) => {
          const errorMessage =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch user details.";
          setError(errorMessage);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRolesChange = (selectedOptions) => {
    setFormData((prevState) => ({
      ...prevState,
      roles: selectedOptions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const rolesAsString = formData.roles.map((role) => role.value).join(","); // Convert selected roles to comma-separated string since api requiers such format

    try {
      if (isEditing) {
        await editUser(id, { ...formData, roles: rolesAsString });
      } else {
        await addUser({ ...formData, roles: rolesAsString });
      }
      navigate(USERS_ROUTE);
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
    <div className="container mt-3 user-form-container">
      <h2>{isEditing ? `Edit User` : `Add User`}</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
          <p>Loading...</p>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isEditing ? "Leave blank to keep unchanged" : ""}
              autoComplete={isEditing ? "current-password" : "new-password"}
              required={!isEditing}
            />
          </Form.Group>

          <Form.Group controlId="roles">
            <Form.Label>Roles</Form.Label>
            <Select
              isMulti
              options={roleOptions}
              value={formData.roles}
              onChange={handleRolesChange}
              className="role-select"
            />
          </Form.Group>

          <Form.Group controlId="isVerified" className="mt-4">
            <Form.Label>Verification Status</Form.Label>
            <div className="verified-checkbox-container">
              <Form.Check
                type="checkbox"
                label="Verified"
                name="isVerified"
                checked={formData.isVerified}
                onChange={handleChange}
              />
            </div>
          </Form.Group>

          <CustomButton
            type="submit"
            disabled={loading}
            className="custom-button-primary"
          >
            {isEditing ? "Update User" : "Add User"}
          </CustomButton>
        </Form>
      )}
    </div>
  );
};

export default AddEditUserPage;
