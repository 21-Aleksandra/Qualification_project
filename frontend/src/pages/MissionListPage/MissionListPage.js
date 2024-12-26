import React, { useEffect, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { Spinner, Alert } from "react-bootstrap";
import { getMissionList } from "../../api/MissionAPI";
import MissionFilter from "../../components/Sections/MissionHelperTableSections/MissionHelperTableFilter/MissionHelperTableFilter";
import MissionHelperTableList from "../../components/Sections/MissionHelperTableSections/MissionHelperTableList/MissionHelperTableList";

import "./MissionListPage.css";

//Fetches, displays, and filters the list of missions along with edit buttons for each mission
// The filter is front-end based and allows to filter mission by name
// making page observable for mobx dynamic changes and for sharing data among components
const MissionListPage = observer(() => {
  const { mission } = useContext(Context); // Accesses global mission state from context.
  const [filteredMissions, setFilteredMissions] = useState([]); // Stores the list of missions after filtering.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMissionList();
        mission.setMissions(response.missions || []); // updates global store for multi-component access
        setFilteredMissions(response.missions || []); // initial filtered list state (no filters)
      } catch (error) {
        console.error("Error fetching missions:", error);
        setError(
          error?.message || "Failed to load missions. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [mission]); // Dependency on 'mission' ensures that the effect re-runs if the context changes.

  const handleFilterChange = (filteredData) => {
    setFilteredMissions(filteredData);
  };

  if (loading) {
    return (
      <div id="mission-loading" className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert id="mission-error" variant="danger" className="my-5 text-center">
        {error}
      </Alert>
    );
  }

  return (
    <div className="container mt-3">
      <div className="mission-page-wrapper">
        <div className="mission-list-container">
          {filteredMissions.length === 0 ? (
            <div className="no-missions-message">No missions found</div>
          ) : (
            <MissionHelperTableList missions={filteredMissions} />
          )}
        </div>
        <div className="mission-additional-components">
          <div className="filter-panel-container">
            <MissionFilter
              onFilterChange={handleFilterChange} // Passes the filter change handler to the filter component.
              missions={mission.missions} // Provides the original list of missions for filtering.
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default MissionListPage;
