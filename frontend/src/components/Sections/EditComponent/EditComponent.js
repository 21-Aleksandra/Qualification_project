import React from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../Common/CustomButton/CustomButton";
import "./EditComponent.css";

// Generic edit component - allows to pass selected ids for deletion or one id for opening edit page for element
// Also has an unselect button which allows to uncheck elements from list and empty the selectedId array
const EditComponent = ({
  addPath, // a path to objects add form
  editPath, // a path to objects edit form
  deleteApiRequest, // a request for object mass-deletion by ids
  selectedIds, // the ids selected for deletion or edit (if one)
  selectedItems, // The names of selected items for deletion for easier understating
  onUnselectAll, // function to unselect all checkboxes
  hideAddEdit = false,
}) => {
  const navigate = useNavigate();

  const handleAdd = () => {
    if (addPath) {
      navigate(addPath);
    }
  };

  // Handles input logical errors and informs user about them
  const handleEdit = () => {
    if (selectedIds.length === 0) {
      alert("Please select an item to edit.");
    } else if (selectedIds.length > 1) {
      alert("Only one item can be edited at a time. Please select only one."); // cannot edit 2 items at a time
    } else if (editPath) {
      navigate(editPath.replace(":id", selectedIds[0]));
    }
  };

  // Handles delete logical errors and informs user about them
  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Please select items to delete.");
    } else {
      const itemNames = selectedItems
        .map((item) => item.title || item.name || item.id)
        .join(", "); // displays the selected for deletion object names or titel or lastly ids for easier undertanding

      const confirmed = window.confirm(
        `Are you sure you want to delete the following items: ${itemNames}?` // prevents accidental deletion
      );

      if (confirmed) {
        try {
          await deleteApiRequest(selectedIds);
          onUnselectAll();
        } catch (error) {
          console.error("Delete failed", error.message);
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
