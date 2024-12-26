import React, { useState } from "react";
import CustomButton from "../../../Common/CustomButton/CustomButton";
import { listUserEvents } from "../../../../api/EventUserAPI";
import "./MyEventSimpleFilter.css";

// Simple my event filter that allows user to filter his/her events by dates and names
// The filtering happens on backend
const MyEventSimpleFilter = ({ setEvents, userId }) => {
  const [filters, setFilters] = useState({
    name: null,
    dateFrom: null,
    dateTo: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const applyFilters = async () => {
    try {
      setLoading(true);
      setError(null);

      // Function to apply the set filters and fetch matching events
      const filteredEvents = await listUserEvents(userId, {
        name: filters.name,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
      });

      setEvents(filteredEvents || []);
    } catch (err) {
      setError(
        err.message || "Failed to fetch filtered events. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    try {
      setLoading(true);
      setError(null);

      const allEvents = await listUserEvents(userId);
      setEvents(allEvents || []);
    } catch (err) {
      setError(err.message || "Failed to reset filters. Please try again.");
    } finally {
      setLoading(false);
    }

    setFilters({ name: null, dateFrom: null, dateTo: null });
  };

  return (
    <div className="simple-filter-container">
      <h3>Filter Events</h3>
      {error && <p className="error-message">{error}</p>}
      <div>
        <label htmlFor="filter-name">Name:</label>
        <input
          id="filter-name"
          type="text"
          value={filters.name || ""}
          onChange={(e) =>
            setFilters({ ...filters, name: e.target.value || null })
          }
          placeholder="Enter event name"
        />
      </div>
      <div>
        <label htmlFor="filter-date-from">Date From:</label>
        <input
          id="filter-date-from"
          type="date"
          value={filters.dateFrom || ""}
          onChange={(e) =>
            setFilters({ ...filters, dateFrom: e.target.value || null })
          }
        />
      </div>
      <div>
        <label htmlFor="filter-date-to">Date To:</label>
        <input
          id="filter-date-to"
          type="date"
          value={filters.dateTo || ""}
          onChange={(e) =>
            setFilters({ ...filters, dateTo: e.target.value || null })
          }
        />
      </div>
      <div className="button-group">
        <CustomButton
          onClick={applyFilters}
          size="md"
          className="apply-button"
          disabled={loading}
        >
          {loading ? "Applying..." : "Apply Filters"}
        </CustomButton>
        <CustomButton
          onClick={resetFilters}
          size="md"
          className="reset-button"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Filters"}
        </CustomButton>
      </div>
    </div>
  );
};

export default MyEventSimpleFilter;
