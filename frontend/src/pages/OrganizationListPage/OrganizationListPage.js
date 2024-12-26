import React, { useEffect, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { Spinner, Alert } from "react-bootstrap";
import { getMainOrganizationList } from "../../api/MainOrganizationAPI";
import MainOrganizationFilter from "../../components/Sections/MainOrganizationHelperTableSections/MainOrganizationHelperTableFilter/MainOrganizationHelperTableFilter";
import MainOrganizationHelperTableList from "../../components/Sections/MainOrganizationHelperTableSections/MainOrganizationHelperTableList/MainOrganizationHelperTableList";

import "./OrganizationListPage.css";

// Page with all main organization list. Has a name filter that uses frontend filtering
// Has an edit buttons to edit organization data.
const OrganizationListPage = observer(() => {
  // making page observable for mobx dynamic changes
  const { mainOrganization } = useContext(Context); // Accessing the MobX store context
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect hook to fetch organization data when the component mounts
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMainOrganizationList();
        mainOrganization.setOrganizations(response.organizations || []);
        setFilteredOrganizations(response.organizations || []);
      } catch (error) {
        console.error("Error fetching organizations:", error);
        setError(
          error?.message ||
            "Failed to load organizations. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [mainOrganization]); // Dependency on `mainOrganization` ensures updates if its reference changes

  // Handler to update the filtered organization list using frontend filter
  const handleFilterChange = (filteredData) => {
    setFilteredOrganizations(filteredData);
  };

  if (loading) {
    return (
      <div id="organization-loading" className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        id="organization-error"
        variant="danger"
        className="my-5 text-center"
      >
        {error}
      </Alert>
    );
  }

  return (
    <div className="container mt-3">
      <div className="organization-page-wrapper">
        <div className="organization-list-container">
          {filteredOrganizations.length === 0 ? (
            <div className="no-organizations-message">
              No organizations found
            </div>
          ) : (
            <MainOrganizationHelperTableList
              organizations={filteredOrganizations}
            />
          )}
        </div>
        <div className="organization-additional-components">
          <div className="filter-panel-container">
            <MainOrganizationFilter
              onFilterChange={handleFilterChange}
              organizations={mainOrganization.organizations}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default OrganizationListPage;
