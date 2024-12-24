import React from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../Common/CustomButton/CustomButton";
import "./EditComponent.css";

const EditComponent = ({
  addPath,
  editPath,
  deleteApiRequest,
  selectedIds,
  selectedItems,
  onUnselectAll,
  hideAddEdit = false,
}) => {
  const navigate = useNavigate();

  const handleAdd = () => {
    if (addPath) {
      navigate(addPath);
    }
  };

  const handleEdit = () => {
    if (selectedIds.length === 0) {
      alert("Please select an item to edit.");
    } else if (selectedIds.length > 1) {
      alert("Only one item can be edited at a time. Please select only one.");
    } else if (editPath) {
      navigate(editPath.replace(":id", selectedIds[0]));
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Please select items to delete.");
    } else {
      const itemNames = selectedItems
        .map((item) => item.title || item.name || item.id)
        .join(", ");

      const confirmed = window.confirm(
        `Are you sure you want to delete the following items: ${itemNames}?`
      );

      if (confirmed) {
        try {
          await deleteApiRequest(selectedIds);
          onUnselectAll();
        } catch (error) {
          console.error("Delete failed", error);
          alert("Failed to delete items.");
        }
      }
    }
  };

  return (
    <div className="edit-component">
      <div className="edit-box">
        {!hideAddEdit && (
          <>
            <CustomButton onClick={handleAdd} size="md" className="edit-button">
              Add
            </CustomButton>
            <CustomButton
              onClick={handleEdit}
              size="md"
              className="edit-button"
            >
              Edit
            </CustomButton>
          </>
        )}
        <CustomButton onClick={handleDelete} size="md" className="edit-button">
          Delete
        </CustomButton>
        <CustomButton onClick={onUnselectAll} size="md" className="edit-button">
          Unselect All
        </CustomButton>
      </div>
    </div>
  );
};

export default EditComponent;
