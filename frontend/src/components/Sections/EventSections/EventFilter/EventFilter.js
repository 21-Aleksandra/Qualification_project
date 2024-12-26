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

// This component allows to filter on backend events from context by cities, subsidiaries associated etc
// Is observable for dynamic store changes (in case of new elemets addition somewhere else and to communicate effectivly with the store)
const EventFilter = observer(() => {
  const { event, address, eventType, user, subsidiary } = useContext(Context);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRoles, setUserRoles] = useState([]);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    // Fetch and store user roles on component mount
    const roles = Array.isArray(user.roles) ? user.roles : [user.roles];
    const validRoles = roles.map(Number).filter((role) => !isNaN(role));
    setUserRoles(validRoles);
    setIsManager(validRoles.includes(UserRoles.MANAGER));
  }, [user.roles]);

  const userId = user.id;

  // useCallback for memoization of the fetchFilterData function and avoid uneccesary re-fetch
  const fetchFilterData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch address data based on user ID and roles
      // gets only manager authored event addresses if user has role manager
      const addressResponse = await getEventAddresses({
        userId,
        userRoles: userRoles.join(","),
      });
      address.setAddresses(addressResponse || []);

      const eventTypeResponse = await getEventTypeList({
        userId: isManager ? userId : undefined, // Fetch all event types related to managers
        userRoles: userRoles.join(","),
      });
      eventType.setEventTypes(eventTypeResponse || []);

      const subsidiaryResponse = await getSubsidiaryNames({
        userId: isManager ? userId : undefined, // Fetch all subsidiaries types related to  managers
        userRoles: userRoles.join(","),
      });
      subsidiary.setNames(subsidiaryResponse || []);

      setLoading(false);
    } catch (err) {
      setError(err?.message || "Failed to load filters. Please try again.");
      setLoading(false);
    }
  }, [userId, userRoles, address, eventType, subsidiary, isManager]);

  // Fetch filter data on component mount and when dependencies change
  useEffect(() => {
    fetchFilterData();
  }, [fetchFilterData]);

  const applyEventFilters = async () => {
    const sortMapping = {
      nameAsc: { sortBy: "name", sortOrder: "asc" },
      nameDesc: { sortBy: "name", sortOrder: "desc" },
      oldest: { sortBy: "createdAt", sortOrder: "asc" },
      newest: { sortBy: "createdAt", sortOrder: "desc" },
    };
    const { sortBy, sortOrder } = sortMapping[event.filters.sortOption] || {};

    // Construct filter parameters(including manager data to fecth only his/her authored events always)
    const filterParams = {
      userId: isManager ? userId : undefined,
      userRoles: userRoles.join(","), // since api takes cities params as comma separated string of numbers (e.g. 1,2,3)
      name: event.filters.searchName,
      cities: event.filters.selectedCities.join(","), // since api takes cities params as comma separated strings(e.g Riga, Tallin)
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
      if (isManager) {
        event.setEvents(response || [], true);
      } else {
        event.setEvents(response || []);
      }
      event.setParams(filterParams);
    } catch (err) {
      setError(err?.message || "No events found with the selected filters.");
    }
  };

  // Calculate filtered cities based on selected countries (e.h. in order to not search for latvian city if Estonia is selected and so on )
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
      if (isManager) {
        event.setEvents(response || [], true); // display even future events for managers
      } else {
        event.setEvents(response || []); // hide future events from regular users(done inside the store)
      }

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
        options={subsidiary.names.map((sub) => ({
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

      <div className="button-group">
        <CustomButton size="md" onClick={applyEventFilters}>
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
