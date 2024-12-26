import React, { useEffect, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import SubsidiaryList from "../../components/Sections/SubsidiarySections/SubsidiaryList/SubsidiaryList";
import {
  getSubsidiaryFilteredList,
  deleteSubsidiaries,
} from "../../api/SubsidiaryAPI";
import Pagination from "../../components/Common/Pagination/Pagination";
import FilterPanel from "../../components/Sections/SubsidiarySections/SubsidiaryFilter/SubsidiaryFilter";
import EditComponent from "../../components/Sections/EditComponent/EditComponent";
import UserRoles from "../../utils/roleConsts";
import { Spinner, Alert } from "react-bootstrap";
import {
  SUBSIDIARY_EDIT_ROUTE,
  SUBSIDIARY_ADD_ROUTE,
} from "../../utils/routerConsts";
import "./SubsidiaryPage.css";

// Page for listing all the subsidiaries with filter that uses backend-based filtering.
// Allows manager to add/delete/edit its subsidiaries as well
// For regular users gets all subsidiaries

const SubsidiaryPage = observer(() => {
  // making page observable for mobx changes
  const { subsidiary, user } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const userId = user._id; //  for role-based API calls

  useEffect(() => {
    const fetchSubsidiaries = async () => {
      try {
        setLoading(true);
        setError(null);

        let params = {};

        // If user has manager role, include their user ID and roles in the API call
        if (user.roles.includes(UserRoles.MANAGER)) {
          params = {
            userId,
            userRoles: user.roles.join(","), // the api takes roles as comma-separated string
          };
        }
        let response;
        // Fetch subsidiaries based on the current filter params if filtering already happened or default ones
        if (subsidiary.params != null) {
          response = await getSubsidiaryFilteredList(subsidiary.params);
        } else {
          response = await getSubsidiaryFilteredList(params);
        }

        subsidiary.setSubsidiaries(response || []);
      } catch (err) {
        console.error("Failed to fetch subsidiaries:", err);
        setError(
          err?.message || "Failed to load subsidiaries. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubsidiaries();
  }, [subsidiary._currentPage, subsidiary, userId, user.roles]); // Dependencies to trigger re-fetch on their change

  // Handle checkbox changes for selecting/unselecting subsidiaries
  const handleCheckboxChange = (id, isChecked) => {
    setSelectedIds(
      (prev) =>
        isChecked
          ? [...prev, id] // Add the ID if it's checked
          : prev.filter((selectedId) => selectedId !== id) // Remove the ID if it's unchecked
    );
  };

  const handleUnselectAll = () => {
    setSelectedIds([]);
  };

  const handleDelete = async (ids) => {
    try {
      console.log("Deleting IDs:", ids);
      await deleteSubsidiaries(ids);
      const response = await getSubsidiaryFilteredList({
        userId,
        userRoles: user.roles.join(","), // the api takes roles as comma-separated string
      });
      subsidiary.setSubsidiaries(response || []);
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed to delete subsidiaries:", err);
      alert("Error deleting subsidiaries.");
    }
  };

  if (loading) {
    return (
      <div id="subsidiary-loading" className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        id="subsidiary-error"
        variant="danger"
        className="my-5 text-center"
      >
        {error}
      </Alert>
    );
  }

  // Filter subsidiaries based on selectedIds for deletion
  const selectedItems = subsidiary.subsidiaries.filter((subsidiaryItem) =>
    selectedIds.includes(subsidiaryItem.id)
  );

  return (
    <div className="container mt-3">
      <h2 className="mb-3">Subsidiaries</h2>
      <div className="subsidiary-page-wrapper">
        <div className="subsidiary-list-container">
          {subsidiary.subsidiaries.length === 0 ? (
            <div className="no-subsidiaries-message">No subsidiaries found</div>
          ) : (
            <SubsidiaryList
              selectedSubsidiaries={selectedIds}
              onCheckboxChange={handleCheckboxChange}
            />
          )}
        </div>
        <div className="edit-filter-box">
          {user.roles.includes(UserRoles.MANAGER) && (
            <div className="edit-panel-container">
              <EditComponent
                addPath={SUBSIDIARY_ADD_ROUTE}
                editPath={SUBSIDIARY_EDIT_ROUTE}
                deleteApiRequest={handleDelete}
                selectedIds={selectedIds}
                selectedItems={selectedItems}
                onUnselectAll={handleUnselectAll}
              />
            </div>
          )}
          <div className="filter-panel-container">
            <FilterPanel />
          </div>
        </div>
      </div>
      <Pagination store={subsidiary} />
    </div>
  );
});

export default SubsidiaryPage;
