import React from "react";
import PropTypes from "prop-types";

/**
 * A horizontal block showing question data.
 * @param {Object} props - Props passed down from the NewQuiz component.
 */
function Question(props) {
  return (
    <div className="new-question">
      <button className="close-button" onClick={() => props.delete(props.id)}>
        &#10005;
      </button>
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
  correctAnswer: PropTypes.string.isRequired,
  delete: PropTypes.func.isRequired
};

export default Question;
