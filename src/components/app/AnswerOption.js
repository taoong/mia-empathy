import React, { Component } from "react";
import PropTypes from "prop-types";

class AnswerOption extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false
    };

    this.audio = new Audio(require("../../" + this.props.answerContent));
  }

  playSound = () => {
    let playPromise = this.audio.play();
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

  onAnswerSelected = event => {
    this.playSound();
    this.props.onAnswerSelected(event);
  };

  renderFaceOption = () => {
    return (
      <li className="answerOption">
        <button
          className="radioCustomButton"
          name="radioGroup"
          id={this.props.answerContent}
          value={this.props.answerContent}
          onClick={this.props.onAnswerSelected}
          style={{
            border: "8px solid " + this.props.color[0],
            background: require("../../" + this.props.answerContent),
            backgroundColor:
              this.props.answerContent === this.props.selectedAnswer
                ? this.props.color[1]
                : "#FFF"
          }}
        />

        <label className="radioCustomLabel" htmlFor={this.props.answerContent}>
          {/* {this.props.answerContent} */}
        </label>
      </li>
    );
  };

  renderVoiceOption = () => {
    return (
      <li className="answerOption">
        <button
          className="radioCustomButton voice-option"
          name="radioGroup"
          id={this.props.answerContent}
          value={this.props.answerContent}
          onClick={this.onAnswerSelected}
          style={{
            border: "8px solid " + this.props.color[0],
            backgroundColor:
              this.props.answerContent === this.props.selectedAnswer
                ? this.props.color[1]
                : "#FFF"
          }}
        />

        <label className="radioCustomLabel" htmlFor={this.props.answerContent}>
          {/* {this.props.answerContent} */}
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
