import React from "react";
import PropTypes from "prop-types";

function QuestionCount(props) {
  return (
    <div className="questionCount">
      Question <span>{props.questionNumber}</span> of <span>{props.total}</span>
    </div>
  );
}

QuestionCount.propTypes = {
  questionNumber: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
};

export default QuestionCount;
