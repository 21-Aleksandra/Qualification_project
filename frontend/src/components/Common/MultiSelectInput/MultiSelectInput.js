import React, { useState } from "react";
import "./MultiSelectInput.css";

const MultiSelectInput = ({
  label,
  searchValue,
  setSearchValue,
  options,
  selectedValues,
  setSelectedValues,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

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
      <div className="selected-items">
        {selectedValues.map((value) => (
          <span key={value} className="selected-item">
            {options.find((opt) => opt.id === value || opt.name === value)
              ?.name || value}
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
