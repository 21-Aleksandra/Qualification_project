import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import CustomButton from "../../../Common/CustomButton/CustomButton";

// This component is used to filter the main organization based on name on frontend side
// Is observable for dynamic store changes (in case of new elemets addition somewhere else and to communicate effectivly with the store)
const MainOrganizationFilter = observer(({ onFilterChange, organizations }) => {
  const [localFilterName, setLocalFilterName] = useState("");

  const applyFilter = () => {
    // Filter the organizations array based on the event type name matching the filter text
    const filteredData = organizations.filter((org) =>
      org.name.toLowerCase().includes(localFilterName.toLowerCase())
    );
    onFilterChange(filteredData);
  };

  const resetFilters = () => {
    setLocalFilterName("");
    onFilterChange(organizations);
  };

  return (
    <div className="filter-panel">
      <h3>Filter Main Organizations</h3>

      <div className="input-group">
        <label htmlFor="name">Organization Name</label>
        <input
          id="name"
          type="text"
          value={localFilterName}
          onChange={(e) => setLocalFilterName(e.target.value)} // Update localFilterName on input change
          placeholder="Enter organization name"
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

export default MainOrganizationFilter;
