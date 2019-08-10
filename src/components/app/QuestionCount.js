import React from "react";
import PropTypes from "prop-types";

/**
 * Shows a dot progress bar to help show the user how far along the quiz they are.
 * @param {*} props - Props passed down from the Quiz component.
 * @returns {JSX} A dot progress bar.
 */
function QuestionCount(props) {
  let circles = [];
  for (var i = 1; i <= props.total; i++) {
    // For the current question, make the respective circle a darker shade of grey.
    if (i === props.questionNumber) {
      circles.push(<div key={i} className="progress-circle dark" />);
    }

    // Make all other circles the same lighter shade of grey.
    else {
      circles.push(<div key={i} className="progress-circle light" />);
    }
  }
  return <div className="questionCount">{circles}</div>;
}

/**
 * Props passed down from the Quiz component.
 */
QuestionCount.propTypes = {
  questionNumber: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
};

export default QuestionCount;
