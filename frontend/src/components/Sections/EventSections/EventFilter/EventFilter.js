import React, { useState, useEffect, useContext, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { getEventAddresses } from "../../../../api/AddressAPI";
import { getEventTypeList } from "../../../../api/EventTypeAPI";
import { getSubsidiaryNames } from "../../../../api/SubsidiaryAPI";
import { getEventFilteredList } from "../../../../api/EventAPI";
import MultiSelectInput from "../../../Common/MultiSelectInput/MultiSelectInput";
import CustomButton from "../../../Common/CustomButton/CustomButton";
import { Context } from "../../../../index";
import UserRoles from "../../../../utils/roleConsts";

const EventFilter = observer(() => {
  const { event, address, eventType, user } = useContext(Context);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    const roles = Array.isArray(user.roles) ? user.roles : [user.roles];
    const validRoles = roles.map(Number).filter((role) => !isNaN(role));
    setUserRoles(validRoles);
    setIsManager(validRoles.includes(UserRoles.MANAGER));
  }, [user.roles]);

  const userId = user.id;

  const fetchFilterData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const addressResponse = await getEventAddresses({
        userId,
        userRoles: userRoles.join(","),
      });
      address.setAddresses(addressResponse || []);

      const eventTypeResponse = await getEventTypeList({
        userId: isManager ? userId : undefined,
        userRoles: userRoles.join(","),
      });
      eventType.setEventTypes(eventTypeResponse || []);

      const subsidiaryResponse = await getSubsidiaryNames({
        userId: isManager ? userId : undefined,
        userRoles: userRoles.join(","),
      });
      setSubsidiaries(subsidiaryResponse || []);

      setLoading(false);
    } catch (err) {
      setError(err?.message || "Failed to load filters. Please try again.");
      setLoading(false);
    }
  }, [userId, userRoles, address, eventType, isManager]);

  useEffect(() => {
    fetchFilterData();
  }, [fetchFilterData]);

  const applyFilters = async () => {
    const sortMapping = {
      nameAsc: { sortBy: "name", sortOrder: "asc" },
      nameDesc: { sortBy: "name", sortOrder: "desc" },
      oldest: { sortBy: "dateFrom", sortOrder: "asc" },
      newest: { sortBy: "dateFrom", sortOrder: "desc" },
    };
    const { sortBy, sortOrder } = sortMapping[event.filters.sortOption] || {};

    const filterParams = {
      userId: isManager ? userId : undefined,
      userRoles: userRoles.join(","),
      name: event.filters.searchName,
      cities: event.filters.selectedCities.join(","),
      countries: event.filters.selectedCountries.join(","),
      subsidiaryIds: event.filters.selectedSubsidiaryIds.join(","),
      typeIds: event.filters.selectedTypeIds.join(","),
      dateFrom: event.filters.dateFrom,
      dateTo: event.filters.dateTo,
      applicationDeadline: event.filters.applicationDeadline,
      sortBy,
      sortOrder,
    };

    try {
      setError("");
      const response = await getEventFilteredList(filterParams);
      event.setEvents(response || []);
      event.setParams(filterParams);
    } catch (err) {
      setError(err?.message || "No events found with the selected filters.");
    }
  };

  const filteredCities = address.getFilteredCities(
    address.addresses,
    event.filters.selectedCountries
  );

  const handleCountryChange = (selectedCountries) => {
    event.setFilters({
      ...event.filters,
      selectedCountries,
      selectedCities: [],
    });
  };

  const resetFilters = async () => {
    event.resetFilters();

    try {
      setError("");
      const response = await getEventFilteredList({
        userId: isManager ? userId : undefined,
        userRoles: userRoles.join(","),
      });
      event.setEvents(response || []);
      event.setParams(null);
    } catch (err) {
      setError(err?.message || "Failed to reset filters. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="filter-panel">
      <h3>Filter Events</h3>
      {error && <div className="error-panel">{error}</div>}

      <div>
        <label>Search Name</label>
        <input
          type="text"
          value={event.filters.searchName}
          onChange={(e) =>
            event.setFilters({ ...event.filters, searchName: e.target.value })
          }
          placeholder="Enter event name"
        />
      </div>

      <MultiSelectInput
        label="Countries"
        searchValue={event.filters.searchCountries}
        setSearchValue={(value) =>
          event.setFilters({ ...event.filters, searchCountries: value })
        }
        options={address.countries.map((country) => ({ name: country }))}
        selectedValues={event.filters.selectedCountries}
        setSelectedValues={handleCountryChange}
      />

      <MultiSelectInput
        label="Cities"
        searchValue={event.filters.searchCities}
        setSearchValue={(value) =>
          event.setFilters({ ...event.filters, searchCities: value })
        }
        options={filteredCities.map((city) => ({ name: city }))}
        selectedValues={event.filters.selectedCities}
        setSelectedValues={(value) =>
          event.setFilters({
            ...event.filters,
            selectedCities: value,
          })
        }
      />

      <MultiSelectInput
        label="Event Types"
        options={eventType?.event_types?.map((type) => ({
          name: type.name,
          id: type.id,
        }))}
        setSearchValue={(value) =>
          event.setFilters({ ...event.filters, searchType: value })
        }
        searchValue={event.filters.searchType}
        selectedValues={event.filters.selectedTypeIds}
        setSelectedValues={(value) =>
          event.setFilters({ ...event.filters, selectedTypeIds: value })
        }
      />

      <MultiSelectInput
        label="Subsidiaries"
        options={subsidiaries.map((sub) => ({
          name: sub.name,
          id: sub.id,
        }))}
        setSearchValue={(value) =>
          event.setFilters({ ...event.filters, searchSubsidiary: value })
        }
        searchValue={event.filters.searchSubsidiary}
        selectedValues={event.filters.selectedSubsidiaryIds}
        setSelectedValues={(value) =>
          event.setFilters({ ...event.filters, selectedSubsidiaryIds: value })
        }
      />

      <div>
        <label>Date From</label>
        <input
          type="date"
          value={event.filters.dateFrom || ""}
          onChange={(e) =>
            event.setFilters({ ...event.filters, dateFrom: e.target.value })
          }
        />
      </div>

      <div>
        <label>Date To</label>
        <input
          type="date"
          value={event.filters.dateTo || ""}
          onChange={(e) =>
            event.setFilters({ ...event.filters, dateTo: e.target.value })
          }
        />
      </div>

      <div>
        <label>Application Deadline</label>
        <input
          type="date"
          value={event.filters.applicationDeadline || ""}
          onChange={(e) =>
            event.setFilters({
              ...event.filters,
              applicationDeadline: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label>Sort By</label>
        <select
          value={event.filters.sortOption}
          onChange={(e) =>
            event.setFilters({ ...event.filters, sortOption: e.target.value })
          }
        >
          <option value="nameAsc">Name A-Z</option>
          <option value="nameDesc">Name Z-A</option>
          <option value="oldest">Oldest First</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      <div className="button-group">
        <CustomButton size="md" onClick={applyFilters}>
          Apply Filters
        </CustomButton>
        <CustomButton size="md" onClick={resetFilters} className="clear-button">
          Reset Filters
        </CustomButton>
      </div>
    </div>
  );
});

export default EventFilter;
