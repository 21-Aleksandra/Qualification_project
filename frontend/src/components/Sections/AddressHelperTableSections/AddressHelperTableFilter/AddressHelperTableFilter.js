import React, { useState, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../../../index";
import MultiSelectInput from "../../../Common/MultiSelectInput/MultiSelectInput";
import CustomButton from "../../../Common/CustomButton/CustomButton";

// This component is used to filter the addresses based on country, city, and street on frontend side
// Is observable for dynamic store changes (in case of new elemets addition somewhere else and to communicate effectivly with the store)
const AddressFilter = observer(({ onFilterChange }) => {
  const { address } = useContext(Context);

  // State to hold the selected filters
  // The selected
  const [filters, setFilters] = useState({
    selectedCountries: [], // Selected countries for filtering
    selectedCities: [], // Selected cities for filtering
    searchCountry: "", // Search value for countries
    searchCity: "", // Search value for cities
    street: "", // Street filter (just a scring since might be too much options for dropdown)
  });

  const handleCountryChange = (selectedCountries) => {
    setFilters((prev) => ({
      ...prev,
      selectedCountries,
      selectedCities: [], // Reset selected cities when countries change
    }));
  };

  const handleCityChange = (selectedCities) => {
    setFilters((prev) => ({
      ...prev,
      selectedCities,
    }));
  };

  const resetFilters = () => {
    setFilters({
      selectedCountries: [],
      selectedCities: [],
      searchCountry: "",
      searchCity: "",
      street: "",
    });
    onFilterChange({
      selectedCountries: [],
      selectedCities: [],
      street: "",
    });
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const filteredCities = address.getFilteredCities(
    address.addresses,
    filters.selectedCountries
  );

  return (
    <div className="filter-panel">
      <h3>Filter Addresses</h3>
      <MultiSelectInput
        label="Countries"
        searchValue={filters.searchCountry}
        setSearchValue={(value) =>
          setFilters({ ...filters, searchCountry: value })
        }
        options={address.countries.map((country) => ({ name: country }))}
        selectedValues={filters.selectedCountries}
        setSelectedValues={handleCountryChange}
      />
      <MultiSelectInput
        label="Cities"
        searchValue={filters.searchCity}
        setSearchValue={(value) =>
          setFilters({ ...filters, searchCity: value })
        }
        options={filteredCities.map((city) => ({ name: city }))}
        selectedValues={filters.selectedCities}
        setSelectedValues={handleCityChange}
      />
      <div className="input-group">
        <label htmlFor="street">Street</label>
        <input
          id="street"
          type="text"
          value={filters.street}
          onChange={(e) => setFilters({ ...filters, street: e.target.value })}
          placeholder="Enter street name"
        />
      </div>

      <div className="button-group">
        <CustomButton size="md" onClick={applyFilters} className="apply-button">
          Apply Filters
        </CustomButton>
        <CustomButton size="md" onClick={resetFilters} className="clear-button">
          Reset Filters
        </CustomButton>
      </div>
    </div>
  );
});

export default AddressFilter;
