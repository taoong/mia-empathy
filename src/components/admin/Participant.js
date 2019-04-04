import React from "react";
import PropTypes from "prop-types";

function Participant(props) {
  return (
    <div className="participant">
      <div>{"[" + props.id + "]  " + props.name + ", " + props.age}</div>
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

Participant.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  age: PropTypes.string.isRequired,
  delete: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default Participant;
