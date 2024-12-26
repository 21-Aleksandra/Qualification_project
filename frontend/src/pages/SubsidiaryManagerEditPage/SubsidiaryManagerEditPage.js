import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubsidiaryById } from "../../api/SubsidiaryAPI";
import { getUsers } from "../../api/UserAPI";
import { updateManagers } from "../../api/SubsidiaryAPI";
import { Button, Form, Spinner, Alert } from "react-bootstrap";
import Select from "react-select";
import { MANAGERS_ROUTE } from "../../utils/routerConsts";
import "./SubsidiaryManagerEditPage.css";

// A form to edit manager list of a single subsidiary
// For admins only
const SubsidiaryManagerEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subsidiary, setSubsidiary] = useState(null);
  const [users, setUsers] = useState([]); // All users fetched from the API
  const [selectedManagers, setSelectedManagers] = useState([]); // IDs of currently selected managers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subsidiaryData = await getSubsidiaryById(id);
        setSubsidiary(subsidiaryData);
        const userData = await getUsers();

        // Filter users to get only those with the "MANAGER" role
        const managerUsers = userData.filter((user) =>
          user.Roles.some((role) => role.rolename === "MANAGER")
        );
        setUsers(managerUsers); // Set the filtered users as manager candidates

        // Set the initial selected managers based on the subsidiary's current manager list from API
        const currentManagerIds = subsidiaryData.Users.map((user) => user.id);
        setSelectedManagers(currentManagerIds);

        setLoading(false);
      } catch (error) {
        setError(error?.message || "Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleManagerChange = (selected) => {
    setSelectedManagers(selected.map((manager) => manager.value));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      await updateManagers(id, selectedManagers);
      navigate(MANAGERS_ROUTE);
    } catch (error) {
      alert("Error updating managers:", error.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  // The selected options for the React Select dropdown need to be mapped from manager IDs to user data
  const selectedOptions = selectedManagers.map((id) => ({
    value: id,
    label: users.find((user) => user.id === id)?.username || "Unknown",
  }));

  return (
    <div className="form-container subsidiary-manager-edit">
      <h3>Edit Managers for {subsidiary?.name}</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="subsidiaryName">
          <Form.Label>Subsidiary Name</Form.Label>
          <Form.Control type="text" value={subsidiary?.name} readOnly />
        </Form.Group>
        <Form.Group controlId="managers">
          <Form.Label>Select Managers</Form.Label>
          <Select
            isMulti
            options={users.map((user) => ({
              value: user.id,
              label: user.username,
            }))}
            value={selectedOptions}
            onChange={handleManagerChange}
            className="role-select"
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="custom-button-primary custom-button"
        >
          Save Changes
        </Button>
      </Form>
    </div>
  );
};

export default SubsidiaryManagerEditPage;
