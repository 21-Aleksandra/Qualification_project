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

const UserAdminPage = observer(() => {
  const { adminUsers } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getUsers();
        adminUsers.setUsers(response || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [adminUsers]);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleUnselectAll = () => {
    setSelectedIds([]);
  };

  const handleDelete = async (ids) => {
    try {
      await deleteUsers(ids);
      const response = await getUsers();
      adminUsers.setUsers(response || []);
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed to delete users:", err);
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
