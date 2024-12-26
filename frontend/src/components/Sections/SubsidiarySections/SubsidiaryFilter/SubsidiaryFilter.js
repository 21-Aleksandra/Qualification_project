import React, { useState, useEffect, useContext, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { reaction } from "mobx";
import { Context } from "../../../../index";
import { getSubsidiaryFilteredList } from "../../../../api/SubsidiaryAPI";
import { getSubsidiaryAddressList } from "../../../../api/AddressAPI";
import { getMissionList } from "../../../../api/MissionAPI";
import { getMainOrganizationList } from "../../../../api/MainOrganizationAPI";
import MultiSelectInput from "../../../Common/MultiSelectInput/MultiSelectInput";
import CustomButton from "../../../Common/CustomButton/CustomButton";
import UserRoles from "../../../../utils/roleConsts";
import "./SubsidiaryFilter.css";

// This component allows to filter on backend subsidiaries from context by cities, missions associated etc
const FilterPanel = observer(({ hideFields = false }) => {
  const { subsidiary, address, mission, mainOrganization, user } =
    useContext(Context);

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
  const fetchAddressesAndOptions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch address data based on user ID and roles
      // gets only manager managed subsidiaries addresses if user has role manager
      const addressResponse = await getSubsidiaryAddressList({
        userId,
        userRoles: userRoles.join(","),
      });
      address.setAddresses(addressResponse || []); // Fetch all addresses related to managers subsidiaries

      const orgResponse = await getMainOrganizationList({
        userId,
        userRoles: userRoles.join(","),
      });
      mainOrganization.setOrganizations(orgResponse?.organizations || []); // Fetch all organization related to managers

      const missionResponse = await getMissionList();
      mission.setMissions(missionResponse?.missions || []);

      setLoading(false);
    } catch (err) {
      setError(
        err?.message || "Failed to fetch filter data. Please try again."
      );
      setLoading(false);
    }
  }, [userId, userRoles, address, mainOrganization, mission]);

  useEffect(() => {
    // Create a reaction to re-fetch data when subsidiary.subsidiaries changes
    fetchAddressesAndOptions();
    const disposeSubsidiaryReaction = reaction(
      () => subsidiary.subsidiaries.slice(),
      () => {
        fetchAddressesAndOptions();
      }
    );

    // Cleanup function to dispose of the reaction
    return () => disposeSubsidiaryReaction();
  }, [fetchAddressesAndOptions, subsidiary]);

  const applyFilters = async () => {
    const sortMapping = {
      nameAsc: { sortBy: "name", sortOrder: "asc" },
      nameDesc: { sortBy: "name", sortOrder: "desc" },
      oldest: { sortBy: "createdAt", sortOrder: "asc" },
      newest: { sortBy: "createdAt", sortOrder: "desc" },
    };
    const { sortBy, sortOrder } = sortMapping[subsidiary.filters.sortOption];

    const filterParams = {
      name: subsidiary.filters.searchName,
      countries: subsidiary.filters.selectedCountries.join(","),
      cities: subsidiary.filters.selectedCities.join(","),
      missions: subsidiary.filters.selectedMissions.join(","),
      mainOrganizationIds: subsidiary.filters.selectedOrganizations.join(","),
      sortBy,
      sortOrder,
      userId: isManager ? userId : undefined,
      userRoles: userRoles.join(","),
    };

    try {
      setError("");
      const response = await getSubsidiaryFilteredList(filterParams);
      subsidiary.setSubsidiaries(response || []);
      subsidiary.setParams(filterParams);
    } catch (err) {
      setError(
        err?.message || "No subsidiaries with such filters. Please try again."
      );
    }
  };

  const removeFilters = async () => {
    subsidiary.resetFilters();

    try {
      setError("");
      const fullSubsidiaryList = await getSubsidiaryFilteredList({
        userId: isManager ? userId : undefined,
        userRoles: userRoles.join(","),
      });
      subsidiary.setSubsidiaries(fullSubsidiaryList || []);
      subsidiary.setParams(null);
    } catch (err) {
      setError(err?.message || "Failed to reset filters. Please try again.");
    }
  };

  // Calculate filtered cities based on selected countries (e.h. in order to not search for latvian city if Estonia is selected and so on )
  const handleCountryChange = (selectedCountries) => {
    subsidiary.setFilters({
      ...subsidiary.filters,
      selectedCountries,
      selectedCities: [],
    });
  };

  const filteredCities = address.getFilteredCities(
    address.addresses,
    subsidiary.filters.selectedCountries
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="filter-panel">
      <h3>Filter Subsidiaries</h3>
      {error && <div className="error-panel">{error}</div>}

      <div>
        <label>Search Name</label>
        <input
          type="text"
          value={subsidiary.filters.searchName}
          onChange={(e) =>
            subsidiary.setFilters({
              ...subsidiary.filters,
              searchName: e.target.value,
            })
          }
          placeholder="Enter name"
        />
      </div>

      <div>
        <label>Sort By</label>
        <select
          value={subsidiary.filters.sortOption}
          onChange={(e) =>
            subsidiary.setFilters({
              ...subsidiary.filters,
              sortOption: e.target.value,
            })
          }
        >
          <option value="nameAsc">Name A-Z</option>
          <option value="nameDesc">Name Z-A</option>
          <option value="oldest">Oldest First</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      <MultiSelectInput
        label="Countries"
        searchValue={subsidiary.filters.searchCountry}
        setSearchValue={(value) =>
          subsidiary.setFilters({ ...subsidiary.filters, searchCountry: value })
        }
        options={address.countries.map((country) => ({ name: country }))}
        selectedValues={subsidiary.filters.selectedCountries}
        setSelectedValues={handleCountryChange}
      />

      <MultiSelectInput
        label="Cities"
        searchValue={subsidiary.filters.searchCity}
        setSearchValue={(value) =>
          subsidiary.setFilters({ ...subsidiary.filters, searchCity: value })
        }
        options={filteredCities.map((city) => ({ name: city }))}
        selectedValues={subsidiary.filters.selectedCities}
        setSelectedValues={(value) =>
          subsidiary.setFilters({
            ...subsidiary.filters,
            selectedCities: value,
          })
        }
      />

      {!hideFields && (
        <>
          <MultiSelectInput
            label="Missions"
            searchValue={subsidiary.filters.searchMission}
            setSearchValue={(value) =>
              subsidiary.setFilters({
                ...subsidiary.filters,
                searchMission: value,
              })
            }
            options={mission.missions.map((mission) => ({
              name: mission.name,
              id: mission.id,
            }))}
            selectedValues={subsidiary.filters.selectedMissions}
            setSelectedValues={(value) =>
              subsidiary.setFilters({
                ...subsidiary.filters,
                selectedMissions: value,
              })
            }
          />

          <MultiSelectInput
            label="Organizations"
            searchValue={subsidiary.filters.searchOrganization}
            setSearchValue={(value) =>
              subsidiary.setFilters({
                ...subsidiary.filters,
                searchOrganization: value,
              })
            }
            options={mainOrganization.organizations.map((org) => ({
              name: org.name,
              id: org.id,
            }))}
            selectedValues={subsidiary.filters.selectedOrganizations}
            setSelectedValues={(value) =>
              subsidiary.setFilters({
                ...subsidiary.filters,
                selectedOrganizations: value,
              })
            }
          />
        </>
      )}

      <div className="button-group">
        <CustomButton size="md" onClick={applyFilters}>
          Apply Filters
        </CustomButton>
        <CustomButton
          size="md"
          onClick={removeFilters}
          className="clear-button"
        >
          Remove Filters
        </CustomButton>
      </div>
    </div>
  );
});

export default FilterPanel;
