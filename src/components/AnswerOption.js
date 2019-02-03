import React, { Component } from "react";
import PropTypes from "prop-types";

class AnswerOption extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false
    };
  }

  render() {
    return (
      <li className="answerOption">
        <input
          type="radio"
          className="radioCustomButton"
          name="radioGroup"
          checked={this.props.answerContent === this.props.selectedAnswer}
          id={this.props.answerContent}
          value={this.props.answerContent}
          disabled={this.props.selectedAnswer}
          onChange={this.props.onAnswerSelected}
        />

        <label className="radioCustomLabel" htmlFor={this.props.answerContent}>
          {this.props.answerContent}
        </label>
      </li>
    );
  }
}

AnswerOption.propTypes = {
  answerContent: PropTypes.string.isRequired,
  selectedAnswer: PropTypes.string.isRequired,
  onAnswerSelected: PropTypes.func.isRequired
};

export default AnswerOption;
