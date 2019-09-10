import React from "react";
import PropTypes from "prop-types";

/**
 * A horizontal block showing participant data.
 * @param {Object} props - Props passed down from the NewSession component.
 */
function Participant(props) {
  return <div>{"[" + props.id + "]  " + props.name}</div>;
}

/**
 * Props passed down from the NewSession component.
 */
Participant.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default Participant;
