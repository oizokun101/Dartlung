import React, { useState } from "react";
import "./style.css";

export const AgeStepper = ({ className, onChange, value }) => {
  const [inputValue, setInputValue] = useState(value.toString());

  const validateAndSetValue = (newValue) => {
    let num = parseInt(newValue, 10);
    if (isNaN(num)) return;
    num = Math.max(1, Math.min(12, num));
    onChange(num);
    setInputValue(num.toString());
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    // Allow only numbers
    if (/^\d*$/.test(newValue)) {
      setInputValue(newValue); // Update display value immediately for smooth typing
    }
  };

  const handleInputBlur = () => {
    validateAndSetValue(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      validateAndSetValue(inputValue);
      e.target.blur(); // Remove focus after Enter
    }
  };

  const increment = () => {
    if (value < 12) {
      const newValue = value + 1;
      onChange(newValue);
      setInputValue(newValue.toString());
    }
  };

  const decrement = () => {
    if (value > 1) {
      const newValue = value - 1;
      onChange(newValue);
      setInputValue(newValue.toString());
    }
  };

  return (
    <div className={`age-stepper ${className}`}>
      <button className="stepper-button minus" onClick={decrement}>
        <div className="minus-line" />
      </button>

      <div className="number-display">
        <input
          type="text"
          className="value-input"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          inputMode="numeric"
          pattern="\d*"
        />
      </div>

      <button className="stepper-button plus" onClick={increment}>
        <div className="plus">
          <div className="horizontal-line" />
          <div className="vertical-line" />
        </div>
      </button>
    </div>
  );
};
