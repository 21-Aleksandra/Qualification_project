import React, { useState, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../../../index";
import CustomButton from "../../../Common/CustomButton/CustomButton";
import { getUsers } from "../../../../api/UserAPI";

// User filter for filtering all the users on backend by their ids or usernames
const UserAdminFilter = observer(() => {
  const { adminUsers } = useContext(Context);
  const [filters, setFilters] = useState({
    id: adminUsers.filters.id || "",
    username: adminUsers.filters.username || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value })); // Update specific filter property
  };

  const applyFilters = async () => {
    const filterParams = {
      id: filters.id,
      username: filters.username,
    };

    adminUsers.setFilters(filters);

    try {
      const response = await getUsers(filterParams);
      adminUsers.setUsers(response || []);
    } catch (err) {
      console.error("Error fetching filtered users:", err);
    }
  };

  const resetFilters = async () => {
    adminUsers.resetFilters();
    setFilters({
      id: "",
      username: "",
    });

    try {
      const response = await getUsers();
      adminUsers.setUsers(response || []);
    } catch (err) {
      console.error("Error fetching all users:", err);
    }
  };

  return (
    <div className="filter-panel">
      <h3>Filter Users</h3>

      <div>
        <label>User ID</label>
        <input
          type="text"
          name="id"
          value={filters.id}
          onChange={handleInputChange}
          placeholder="Enter User ID"
        />
      </div>

      <div>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={filters.username}
          onChange={handleInputChange}
          placeholder="Enter Username"
        />
      </div>

      <div className="button-group">
        <CustomButton size="md" onClick={applyFilters}>
          Apply Filters
        </CustomButton>
        <CustomButton size="md" onClick={resetFilters} className="clear-button">
          Reset Filters
        </CustomButton>
      </div>
    </div>
  );
});

export default UserAdminFilter;
