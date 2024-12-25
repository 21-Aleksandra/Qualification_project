import React, { useEffect, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { Spinner, Alert } from "react-bootstrap";
import { getMainOrganizationList } from "../../api/MainOrganizationAPI";
import MainOrganizationFilter from "../../components/Sections/MainOrganizationHelperTableSections/MainOrganizationHelperTableFilter/MainOrganizationHelperTableFilter";
import MainOrganizationHelperTableList from "../../components/Sections/MainOrganizationHelperTableSections/MainOrganizationHelperTableList/MainOrganizationHelperTableList";

import "./OrganizationListPage.css";

const OrganizationListPage = observer(() => {
  const { mainOrganization } = useContext(Context);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError("Failed to load organizations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [mainOrganization]);

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
