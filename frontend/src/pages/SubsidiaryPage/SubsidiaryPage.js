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

const SubsidiaryPage = observer(() => {
  const { subsidiary, user } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const userId = user._id;

  useEffect(() => {
    const fetchSubsidiaries = async () => {
      try {
        setLoading(true);
        setError(null);

        let params = {};
        if (user.roles.includes(UserRoles.MANAGER)) {
          params = {
            userId,
            userRoles: user.roles.join(","),
          };
        }
        const response = await getSubsidiaryFilteredList(params);
        subsidiary.setSubsidiaries(response || []);
      } catch (err) {
        console.error("Failed to fetch subsidiaries:", err);
        setError("Failed to load subsidiaries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubsidiaries();
  }, [subsidiary._currentPage, subsidiary, userId, user.roles]);

  const handleCheckboxChange = (id, isChecked) => {
    setSelectedIds((prev) =>
      isChecked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)
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
        userRoles: user.roles.join(","),
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
