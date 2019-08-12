import React from "react";
import PropTypes from "prop-types";

/**
 * A horizontal block showing participant data.
 * @param {Object} props - Props passed down from the NewSession component.
 */
function Participant(props) {
  return (
    <div className="participant">
      <div>{"[" + props.id + "]  " + props.name}</div>
      <button
        disabled={props.disabled}
        className="close-button"
        onClick={() => props.delete(props.id)}
      >
        &#10005;
      </button>
    </div>
  );
}

/**
 * Props passed down from the NewSession component.
 */
Participant.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  delete: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default Participant;
