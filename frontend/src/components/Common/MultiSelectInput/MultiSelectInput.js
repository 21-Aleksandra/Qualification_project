import React, { useState } from "react";
import "./MultiSelectInput.css";
// MultiSelectInput component provides a searchable
// multi-select input field with the ability to select and deselect items
const MultiSelectInput = ({
  label, // Label to be displayed above the input field
  searchValue, // Current search value (for filtering options)
  setSearchValue, // Function to update the search value
  options, // List of available options to be displayed in the dropdown
  selectedValues, // List of selected values
  setSelectedValues, // Function to update the selected values
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Function to handle selecting/deselecting an option
  const handleOptionSelect = (selectedOption) => {
    if (selectedValues.includes(selectedOption)) {
      setSelectedValues(selectedValues.filter((val) => val !== selectedOption));
    } else {
      setSelectedValues([...selectedValues, selectedOption]);
    }
  };

  const isSelected = (option) => selectedValues.includes(option);

  return (
    <div className="multi-select-input">
      <label>{label}</label>
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={`Search ${label.toLowerCase()}`}
        onFocus={toggleDropdown}
        onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
      />
      <div className={`dropdown ${dropdownOpen ? "open" : ""}`}>
        {dropdownOpen && (
          <ul className="dropdown-list">
            {filteredOptions.map((option) => (
              <li
                key={option.id || option.name}
                className={`dropdown-item ${
                  isSelected(option.id || option.name) ? "selected" : ""
                }`}
                onClick={() => handleOptionSelect(option.id || option.name)}
              >
                {option.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Display the selected items below the input */}
      <div className="selected-items">
        {selectedValues.map((value) => (
          <span key={value} className="selected-item">
            {/* Find the name of the selected option using 'id' or 'name' */}
            {options.find((opt) => opt.id === value || opt.name === value)
              ?.name || value}
            {/* Button to remove the selected item */}
            <button
              type="button"
              onClick={() => {
                setSelectedValues(
                  selectedValues.filter((val) => val !== value)
                );
              }}
            >
              x
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default MultiSelectInput;
