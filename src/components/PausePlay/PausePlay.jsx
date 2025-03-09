import React from "react";
import PropTypes from "prop-types";
import "./style.css";

export const PausePlay = ({ property1, className, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`pause-play ${property1} ${className}`}
      onClick={handleClick}
    >
      {property1 === "pause-button" && (
        <>
          <div className="rectangle" />
          <div className="div" />
        </>
      )}

      {property1 === "play-button" && (
        <img className="img" alt="Play button" src="/img/play-button.svg" />
      )}
    </div>
  );
};

PausePlay.propTypes = {
  property1: PropTypes.oneOf(["pause-button", "play-button"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
};
