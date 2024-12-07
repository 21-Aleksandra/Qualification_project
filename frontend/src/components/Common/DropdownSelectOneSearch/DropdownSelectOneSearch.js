import React from "react";
import Select from "react-select";

const DropdownSelectOneSearch = ({
  options = [],
  value = null,
  onChange,
  placeholder = "Select",
  isSearchable = true,
  labelKey = "name",
  valueKey = "id",
}) => {
  const formattedOptions = options.map((option) => {
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
          .filter((option) => option[valueKey] === value)
          .map((option) => {
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
