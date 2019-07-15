import React, { Component } from "react";
import PropTypes from "prop-types";

class Result extends Component {
  render() {
    const answers = this.props.answers.map((answer, key) => (
      <li key={key}>{answer}</li>
    ));
    var score = this.props.kiosk ? (
      <div>
        <h2>
          You scored{" "}
          <strong>
            {this.props.quizResult}/{this.props.total}
          </strong>
          !
        </h2>
        <h4>You answered:</h4>
        <ul>{answers}</ul>
      </div>
    ) : null;

    return (
      <div className="result card-form">
        <h2>You've finished the quiz!</h2>
        {score}
        <button className="button" onClick={this.props.restartQuiz}>
          Retake quiz
        </button>
      </div>
    );
  }
}

Result.propTypes = {
  quizResult: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  restartQuiz: PropTypes.func.isRequired,
  answers: PropTypes.array.isRequired,
  kiosk: PropTypes.bool.isRequired
};

export default Result;
