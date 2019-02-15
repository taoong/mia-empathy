import React from "react";
import PropTypes from "prop-types";

function Result(props) {
  const answers = props.answers.map(answer => <li>{answer}</li>);
  return (
    <div className="result card-form">
      <h2>
        You scored{" "}
        <strong>
          {props.quizResult}/{props.total}
        </strong>
        !
      </h2>
      <h4>You answered:</h4>
      <ul>{answers}</ul>
      <button className="button" onClick={props.restartQuiz}>
        Retake quiz
      </button>
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
