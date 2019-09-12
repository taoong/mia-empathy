import React from "react";
import PropTypes from "prop-types";

/**
 * A horizontal block showing question data.
 * @param {Object} props - Props passed down from the NewQuiz component.
 */
function Question(props) {
  return (
    <div>
      <div className="row">{"Type: " + props.type}</div>
      <div className="row">{"Question: " + props.question}</div>
      <div className="row">{"Correct Answer: " + props.correctAnswer}</div>
    </div>
  );
}

/**
 * Props passed down from the NewQuiz component.
 */
Question.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  correctAnswer: PropTypes.string.isRequired
};

export default Question;
