import React, { useState } from "react";
import "./style.css";

export const MaleFemale = ({ className, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Male");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
    onChange?.(value);
  };

  return (
    <div className={`MaleFemale ${className}`}>
      <div className="selection" onClick={toggleDropdown}>
        <div className="text-wrapper-3">{selectedValue}</div>
        <img
          className={`polygon ${isOpen ? "rotated" : ""}`}
          alt="Polygon"
          src="/img/polygon-3.svg"
        />
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <div
            className={`dropdown-item ${
              selectedValue === "Male" ? "selected" : ""
            }`}
            onClick={() => handleSelect("Male")}
          >
            Male
          </div>
          <div
            className={`dropdown-item ${
              selectedValue === "Female" ? "selected" : ""
            }`}
            onClick={() => handleSelect("Female")}
          >
            Female
          </div>
        </div>
      )}
    </div>
  );
};
