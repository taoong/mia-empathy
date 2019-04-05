import React from "react";
import PropTypes from "prop-types";

function Question(props) {
  return (
    <div className="new-question">
      <div className="row">
        {"Question: " + props.question}
        <button className="close-button" onClick={() => props.delete(props.id)}>
          &#10005;
        </button>
      </div>
      <div>{"Correct Answer: " + props.correctAnswer}</div>
    </div>
  );
}

Question.propTypes = {
  id: PropTypes.number.isRequired,
  question: PropTypes.string.isRequired,
  correctAnswer: PropTypes.string.isRequired,
  delete: PropTypes.func.isRequired
};

export default Question;
