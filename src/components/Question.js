import React from "react";
import PropTypes from "prop-types";

function Question(props) {
  return (
    <div className="question">
      <h2>{props.questionContent}</h2>
      <img src="../images/face2.jpg" alt="Not found!" />
    </div>
  );
}

Question.propTypes = {
  questionContent: PropTypes.string.isRequired
};

export default Question;
