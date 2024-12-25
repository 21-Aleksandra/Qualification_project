import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import CustomButton from "../../../Common/CustomButton/CustomButton";

const EventTypeFilter = observer(({ onFilterChange, eventTypes }) => {
  const [localFilterName, setLocalFilterName] = useState("");

  const applyFilter = () => {
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
          onChange={(e) => setLocalFilterName(e.target.value)}
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
