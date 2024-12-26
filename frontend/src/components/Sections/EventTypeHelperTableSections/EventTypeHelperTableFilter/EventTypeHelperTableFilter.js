import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import CustomButton from "../../../Common/CustomButton/CustomButton";

// This component is used to filter the event type based on name on frontend side
// Is observable for dynamic store changes (in case of new elemets addition somewhere else and to communicate effectivly with the store)
const EventTypeFilter = observer(({ onFilterChange, eventTypes }) => {
  const [localFilterName, setLocalFilterName] = useState("");

  const applyFilter = () => {
    // Filter the eventTypes array based on the event type name matching the filter text
    const filteredData = eventTypes.filter((eventType) =>
      eventType.name.toLowerCase().includes(localFilterName.toLowerCase())
    );
    onFilterChange(filteredData);
  };

  const resetFilters = () => {
    setLocalFilterName("");
    onFilterChange(eventTypes);
  };

  return (
    <div className="filter-panel">
      <h3>Filter Event Types</h3>

      <div className="input-group">
        <label htmlFor="name">Event Name</label>
        <input
          id="name"
          type="text"
          value={localFilterName}
          onChange={(e) => setLocalFilterName(e.target.value)} // Update localFilterName on input change
          placeholder="Enter event name"
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

export default EventTypeFilter;
