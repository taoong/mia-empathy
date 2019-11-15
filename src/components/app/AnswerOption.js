import { Component } from "react";
import PropTypes from "prop-types";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
class AnswerOption extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false
    };

    // Create an Audio object storing the audio file passed down as props
    this.audio = new Audio(
      require("../../stimuli/" + this.props.answerContent)
    );
  }

  /**
   * Plays an audio file passed down as props.
   */
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

  /**
   * Event handler for when the answer option is selected.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  onAnswerSelected = event => {
    this.playSound();
    this.props.onAnswerSelected(event);
  };

  /**
   * Renders a face answer option.
   * @returns {JSX} A face answer option.
   */
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
            transform:
              this.props.answerContent === this.props.selectedAnswer
                ? "scale(1.1)"
                : "scale(1.0)",
            border: "8px solid " + this.props.color[0],
            backgroundColor:
              this.props.answerContent === this.props.selectedAnswer
                ? this.props.color[1]
                : "#FFF"
          }}
        >
          <img
            className="face-option"
            src={require("../../stimuli/" + this.props.answerContent)}
            alt="Not found!"
          />
        </button>

        <label className="radioCustomLabel" htmlFor={this.props.answerContent}>
          {/* {this.props.answerContent} */}
        </label>
      </li>
    );
  };

  /**
   * Renders a voice answer option.
   * @returns {JSX} A voice answer option.
   */
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
            transform:
              this.props.answerContent === this.props.selectedAnswer
                ? "scale(1.1)"
                : "scale(1.0)",
            border: "8px solid " + this.props.color[0],
            backgroundColor:
              this.props.answerContent === this.props.selectedAnswer
                ? this.props.color[1]
                : "#FFF"
          }}
          css={css`
            &:active {
              background-color: ${this.props.color[0]} !important;
            }
          `}
        />

        <label className="radioCustomLabel" htmlFor={this.props.answerContent}>
          {/* {this.props.answerContent} */}
        </label>
      </li>
    );
  };

  /**
   * Renders an answer option.
   * @returns {JSX} An answer option depending on the question type.
   */
  render() {
    if (this.props.answerType === "voice") {
      return this.renderVoiceOption();
    } else {
      return this.renderFaceOption();
    }
  }
}

/**
 * Props passed down from the Quiz component.
 */
AnswerOption.propTypes = {
  answerType: PropTypes.string.isRequired,
  answerContent: PropTypes.string.isRequired,
  selectedAnswer: PropTypes.string.isRequired,
  onAnswerSelected: PropTypes.func.isRequired,
  color: PropTypes.array.isRequired
};

export default AnswerOption;
