import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import CustomButton from "../../../Common/CustomButton/CustomButton";

// This component is used to filter the missions based on name on frontend side
const MissionFilter = observer(({ onFilterChange, missions }) => {
  const [localFilterName, setLocalFilterName] = useState("");

  const applyFilter = () => {
    // Filter the missions array based on the event type name matching the filter text
    const filteredData = missions.filter((missionItem) =>
      missionItem.name.toLowerCase().includes(localFilterName.toLowerCase())
    );
    onFilterChange(filteredData);
  };

  const resetFilters = () => {
    setLocalFilterName("");
    onFilterChange(missions);
  };

  return (
    <div className="filter-panel">
      <h3>Filter Missions</h3>
      <div className="input-group">
        <label htmlFor="name">Mission Name</label>
        <input
          id="name"
          type="text"
          value={localFilterName}
          onChange={(e) => setLocalFilterName(e.target.value)}
          placeholder="Enter mission name"
        />
      </div>
      <div className="button-group">
        <CustomButton size="md" onClick={applyFilter} className="apply-button">
          Apply Filters
        </CustomButton>
        <CustomButton size="md" onClick={resetFilters} className="clear-button">
          Reset Filters
        </CustomButton>
      </div>
    </div>
  );
});

export default MissionFilter;
