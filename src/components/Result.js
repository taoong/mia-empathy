import React from "react";
import PropTypes from "prop-types";

function Result(props) {
  return (
    <div className="result">
      You prefer <strong>{props.quizResult}</strong>!
      <button onClick={props.restartQuiz}>Retake quiz</button>
    </div>
  );
}

Result.propTypes = {
  quizResult: PropTypes.string.isRequired,
  restartQuiz: PropTypes.func.isRequired
};

export default Result;
