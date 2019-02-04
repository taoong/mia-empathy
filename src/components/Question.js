import React from "react";
import PropTypes from "prop-types";

function Question(props) {
  return (
    <div className="question">
      <h2>{props.questionContent}</h2>
      <img
        src={require("../images/face" + String(props.questionId + 1) + ".jpg")}
        alt="Not found!"
      />
    </div>
  );
}

Question.propTypes = {
  questionContent: PropTypes.string.isRequired,
  questionId: PropTypes.number.isRequired
};

export default Question;
