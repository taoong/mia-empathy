import React from "react";
import PropTypes from "prop-types";

function Result(props) {
  return (
    <div className="result">
      <h4>
        You scored{" "}
        <strong>
          {props.quizResult}/{props.total}
        </strong>
        !
      </h4>
      <h4>{props.answers}</h4>
      <button onClick={props.restartQuiz}>Retake quiz</button>
    </div>
  );
}

Result.propTypes = {
  quizResult: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  restartQuiz: PropTypes.func.isRequired,
  answers: PropTypes.array.isRequired
};

export default Result;
