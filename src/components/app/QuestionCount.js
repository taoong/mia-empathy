import React from "react";
import PropTypes from "prop-types";

function QuestionCount(props) {
  let circles = [];
  for (var i = 1; i <= props.total; i++) {
    if (i === props.questionNumber) {
      circles.push(<div className="progress-circle dark" />);
    } else {
      circles.push(<div className="progress-circle light" />);
    }
  }
  return <div className="questionCount">{circles}</div>;
}

QuestionCount.propTypes = {
  questionNumber: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
};

export default QuestionCount;
