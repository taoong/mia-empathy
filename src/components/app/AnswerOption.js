import React, { Component } from "react";
import PropTypes from "prop-types";

class AnswerOption extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false
    };
  }

  playSound = sound => {
    let audio = new Audio(require("../../" + sound));
    let playPromise = audio.play();
    if (playPromise !== null) {
      playPromise
        .then(() => {
          console.log("played");
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  onChangeSelect = event => {
    this.playSound(event.currentTarget.value);
    this.props.onAnswerSelected(event);
  };

  renderFaceOption = () => {
    return (
      <li className="answerOption">
        <input
          type="radio"
          className="radioCustomButton"
          name="radioGroup"
          checked={this.props.answerContent === this.props.selectedAnswer}
          id={this.props.answerContent}
          value={this.props.answerContent}
          onChange={this.props.onAnswerSelected}
          style={{ border: "2px solid " + this.props.color[1] }}
        />

        <label className="radioCustomLabel" htmlFor={this.props.answerContent}>
          {this.props.answerContent}
        </label>
      </li>
    );
  };

  renderVoiceOption = () => {
    return (
      <li className="answerOption">
        <input
          type="radio"
          className="radioCustomButton"
          name="radioGroup"
          checked={this.props.answerContent === this.props.selectedAnswer}
          id={this.props.answerContent}
          value={this.props.answerContent}
          onChange={this.onChangeSelect}
          style={{ border: "2px solid " + this.props.color[1] }}
        />

        <label className="radioCustomLabel" htmlFor={this.props.answerContent}>
          {this.props.answerContent}
        </label>
      </li>
    );
  };

  render() {
    if (this.props.answerType === "voice") {
      return this.renderVoiceOption();
    } else {
      return this.renderFaceOption();
    }
  }
}

AnswerOption.propTypes = {
  answerType: PropTypes.string.isRequired,
  answerContent: PropTypes.string.isRequired,
  selectedAnswer: PropTypes.string.isRequired,
  onAnswerSelected: PropTypes.func.isRequired,
  color: PropTypes.array.isRequired
};

export default AnswerOption;
