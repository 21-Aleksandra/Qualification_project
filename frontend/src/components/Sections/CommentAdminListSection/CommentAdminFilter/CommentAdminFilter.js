import React, { useState, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../../../index";
import CustomButton from "../../../Common/CustomButton/CustomButton";
import { getAllComments } from "../../../../api/CommentAPI";

const CommentAdminFilter = observer(() => {
  const { comment } = useContext(Context);
  const [filters, setFilters] = useState({
    id: comment.filters.id || "",
    username: comment.filters.username || "",
    text: comment.filters.text || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = async () => {
    const filterParams = {
      id: filters.id,
      username: filters.username,
      text: filters.text,
    };

    comment.setFilters(filters);

    try {
      const response = await getAllComments(filterParams);
      comment.setComments(response || []);
    } catch (err) {
      console.error("Error fetching filtered comments:", err);
    }
  };

  const resetFilters = async () => {
    comment.resetFilters();
    setFilters({
      id: "",
      username: "",
      text: "",
    });

    try {
      const response = await getAllComments();
      comment.setComments(response || []);
    } catch (err) {
      console.error("Error fetching all comments:", err);
    }
  };

  return (
    <div className="filter-panel">
      <h3>Filter Comments</h3>

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

      <div>
        <label>Comment Text</label>
        <input
          type="text"
          name="text"
          value={filters.text}
          onChange={handleInputChange}
          placeholder="Enter Comment Text"
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

export default CommentAdminFilter;
