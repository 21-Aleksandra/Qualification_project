import React from "react";
import Select from "react-select";

// DropdownSelectOneSearch is a reusable dropdown component that supports search functionality and custom labels
const DropdownSelectOneSearch = ({
  options = [], // Array of options to populate the dropdown list
  value = null, // The currently selected value
  onChange,
  placeholder = "Select",
  isSearchable = true, // Flag to enable/disable search functionality in the dropdown
  labelKey = "name", // The key in each option to display as the label
  valueKey = "id", // The key in each option that holds the value for the selected option
}) => {
  const formattedOptions = options.map((option) => {
    // If the labelKey is "addressLabel", we format the label to show a full address
    if (labelKey === "addressLabel") {
      option.label = `${option.country}, ${option.city}, ${option.street}`;
    } else {
      option.label = option[labelKey];
    }
    return {
      value: option[valueKey],
      label: option.label,
    };
  });

  const formattedValue = value
    ? {
        value: value,
        label: options
          .filter((option) => option[valueKey] === value) // Find the selected option based on the value
          .map((option) => {
            // If the labelKey is "addressLabel", we format the label to show a full address
            if (labelKey === "addressLabel") {
              return `${option.country}, ${option.city}, ${option.street}`;
            }
            return option[labelKey];
          })[0],
      }
    : null;

  return (
    <Select
      options={formattedOptions}
      value={formattedValue}
      onChange={onChange}
      isSearchable={isSearchable}
      placeholder={placeholder}
    />
  );
};

export default DropdownSelectOneSearch;
