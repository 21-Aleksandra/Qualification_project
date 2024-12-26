import React, { useEffect, useState, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { Spinner, Alert } from "react-bootstrap";
import { getUsers, deleteUsers } from "../../api/UserAPI";
import UserList from "../../components/Sections/UserSections/UserList/UserList";
import EditComponent from "../../components/Sections/EditComponent/EditComponent";
import UserAdminFilter from "../../components/Sections/UserSections/UserFilter/UserFilter";
import { USERS_ADD_ROUTE, USERS_EDIT_ROUTE } from "../../utils/routerConsts";
import "./UserPage.css";

// Page with user list for adding/ eleting/editing user info. For admins only. Has a filter with user id and username
const UserAdminPage = observer(() => {
  // making page observable for mobx changes
  const { adminUsers } = useContext(Context); // using global user context
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch all users when the component is mounted
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        setError(null); // Reset any existing errors
        const response = await getUsers();
        adminUsers.setUsers(response || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users. Please try again later.", err?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [adminUsers]); // Only re-fetch users if the `adminUsers` store changes

  // Toggle the selection state for the user with the given id
  const handleCheckboxChange = (id) => {
    setSelectedIds(
      (prev) =>
        prev.includes(id)
          ? prev.filter((selectedId) => selectedId !== id) // Remove id if already selected
          : [...prev, id] // Add id if not already selected
    );
  };

  const handleUnselectAll = () => {
    setSelectedIds([]); // Reset selectedIds to an empty array, effectively unselecting all
  };

  const handleDelete = async (ids) => {
    try {
      await deleteUsers(ids);
      const response = await getUsers();
      adminUsers.setUsers(response || []);
      setSelectedIds([]);
    } catch (err) {
      console.error(err?.message || "Failed to delete users:");
      alert("Error deleting users.");
    }
  };

  if (loading) {
    return (
      <div id="user-loading" className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert id="user-error" variant="danger" className="my-5 text-center">
        {error}
      </Alert>
    );
  }

  // Filter users based on selectedIds (used for operations like deleting)
  const selectedItems = adminUsers.users.filter((user) =>
    selectedIds.includes(user.id)
  );

  return (
    <div className="container mt-3">
      <h2 className="mb-3">Users</h2>
      <div className="user-page-wrapper">
        <div className="user-list-container">
          {adminUsers.users.length === 0 ? (
            <div className="no-users-message">No users found</div>
          ) : (
            <UserList
              users={adminUsers.users}
              selectedUsers={selectedIds}
              onCheckboxChange={handleCheckboxChange}
            />
          )}
        </div>
        <div className="user-additional-components">
          <div className="edit-filter-box">
            <div className="edit-panel-container">
              <EditComponent
                addPath={USERS_ADD_ROUTE}
                editPath={USERS_EDIT_ROUTE}
                deleteApiRequest={handleDelete}
                selectedIds={selectedIds}
                selectedItems={selectedItems}
                onUnselectAll={handleUnselectAll}
              />
            </div>
          </div>
          <div className="filter-panel-container">
            <UserAdminFilter />
          </div>
        </div>
      </div>
    </div>
  );
});

export default UserAdminPage;
