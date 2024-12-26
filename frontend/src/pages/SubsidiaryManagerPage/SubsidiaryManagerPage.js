import React, { useEffect, useState, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { Spinner, Alert } from "react-bootstrap";
import { getSubsidiaryFilteredList } from "../../api/SubsidiaryAPI";
import SubsidiaryFilter from "../../components/Sections/SubsidiarySections/SubsidiaryFilter/SubsidiaryFilter";
import UserRoles from "../../utils/roleConsts";
import SubsidiaryManagerList from "../../components/Sections/SubsidiaryManagerSections/SubsidiaryManagerList/SubsidiaryManagerList";

import "./SubsidiaryManagerPage.css";

// Page that lists subsidiaries along with its manager list.
// Has edit button to address to manager assigment form. For admins only.

const SubsidiaryManagerPage = observer(() => {
  // making page observable for mobx changes
  const { subsidiary, user } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = user._id; //  for role-based API calls

  useEffect(() => {
    const fetchSubsidiaries = async () => {
      try {
        setLoading(true);
        setError(null);

        let params = {};
        // If the user is a manager, include their user ID and roles in the parameters
        if (user.roles.includes(UserRoles.MANAGER)) {
          params = {
            userId,
            userRoles: user.roles.join(","), // the api takes roles as comma-separated string
          };
        }
        subsidiary._currentPage = 1; // for avoiding errors since originally subsidairy had pagination
        if (subsidiary.params != null) {
          params = { ...params, ...subsidiary.params }; // Merge custom params from the store if available to avoid errors in search
        }

        const response = await getSubsidiaryFilteredList(params);
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
  }, [subsidiary.params, userId, user.roles, subsidiary]); // Dependencies to trigger effect when parameters change

  if (loading) {
    return (
      <div id="subsidiary-manager-loading" className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        id="subsidiary-manager-error"
        variant="danger"
        className="my-5 text-center"
      >
        {error}
      </Alert>
    );
  }

  return (
    <div className="container mt-3">
      <h2 className="mb-3">Subsidiaries</h2>
      <div className="subsidiary-manager-page-wrapper">
        <div className="subsidiary-manager-list-container">
          {subsidiary._subsidiaries.length === 0 ? (
            <div className="no-subsidiary-manager-message">
              No subsidiaries found
            </div>
          ) : (
            <SubsidiaryManagerList subsidiaries={subsidiary._subsidiaries} />
          )}
        </div>
        <div className="subsidiary-manager-additional-components">
          <div className="filter-panel-container">
            <SubsidiaryFilter hideFields={true} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default SubsidiaryManagerPage;
