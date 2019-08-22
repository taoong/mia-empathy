import React, { Component } from "react";
import PropTypes from "prop-types";

class Instruction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUrl: ""
    };
  }

  /**
   * Currently obsolete function used in the case that firebase storage is used for storing media files.
   */
  updateImage() {
    // TODO: Figure out if Firebase Storage is an option for uploading photos, else just
    // work with images directly from the project folder
    let currentComponent = this;
    this.storageRef
      .child(this.props.imageUrl)
      .getDownloadURL()
      .then(function(url) {
        currentComponent.setState({ imageUrl: url });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  /**
   * Generates the appropriate instruction that matches the question type.
   * @param {string} type - The question-answer type
   *                        (e.g. voice-face means matching 4 face options to 1 voice).
   * @param {array} color - An array storing a primary and secondary hex color at
   *                        indices 0 and 1 respectively.
   * @returns {JSX} The appropriately worded question.
   */

  formatInstruction = (type, color) => {
    if (type === "voice-face") {
      if (!this.props.playedSound) {
        return (
          <h3>
            press the <strong style={{ color: color[0] }}> sound </strong> icon{" "}
            <br />
            to hear the
            <strong style={{ color: color[0] }}> voice </strong>
          </h3>
        );
      }
      return (
        <h3>
          select the{" "}
          <strong style={{ color: color[0] }}> facial expression </strong>{" "}
          <br />
          that best matches the
          <strong style={{ color: color[0] }}> voice </strong>
        </h3>
      );
    } else if (type === "face-voice") {
      if (!this.props.selectedAnswer) {
        return (
          <h3>
            press the <strong style={{ color: color[0] }}> sound </strong> icons{" "}
            <br />
            to hear the
            <strong style={{ color: color[0] }}> voices </strong>
          </h3>
        );
      }
      return (
        <h3>
          select the <strong style={{ color: color[0] }}> voice </strong> <br />{" "}
          that best matches the
          <strong style={{ color: color[0] }}> facial expression </strong>
        </h3>
      );
    } else if (type === "illustration-face") {
      return (
        <h3>
          select the{" "}
          <strong style={{ color: color[0] }}> facial expression </strong>{" "}
          <br /> that best matches the
          <strong style={{ color: color[0] }}> drawing </strong>
        </h3>
      );
    } else if (type === "illustration-voice") {
      if (!this.props.selectedAnswer) {
        return (
          <h3>
            press the <strong style={{ color: color[0] }}> sound </strong> icons{" "}
            <br />
            to hear the
            <strong style={{ color: color[0] }}> voices </strong>
          </h3>
        );
      }
      return (
        <h3>
          select the <strong style={{ color: color[0] }}> voice </strong> <br />{" "}
          that best matches the
          <strong style={{ color: color[0] }}> drawing </strong>
        </h3>
      );
    } else if (type === "story-face") {
      return (
        <div>
          <h3>
            select the{" "}
            <strong style={{ color: color[0] }}> facial expression </strong>{" "}
            <br />
            that best matches the
            <strong style={{ color: color[0] }}> story </strong>
          </h3>
        </div>
      );
    } else if (type === "story-voice") {
      if (!this.props.selectedAnswer) {
        return (
          <h3>
            press the <strong style={{ color: color[0] }}> sound </strong> icons{" "}
            <br />
            to hear the
            <strong style={{ color: color[0] }}> voices </strong>
          </h3>
        );
      }
      return (
        <div>
          <h3>
            select the <strong style={{ color: color[0] }}> voice </strong>{" "}
            <br /> that best matches the
            <strong style={{ color: color[0] }}> story </strong>
          </h3>
        </div>
      );
    }
  };

  /**
   * Renders the question.
   * @returns {JSX} The question.
   */
  render() {
    return (
      <div className="question">
        {this.formatInstruction(this.props.questionType, this.props.color)}
      </div>
    );
  }
}

/**
 * Props passed down from the Quiz component.
 */
Instruction.propTypes = {
  questionType: PropTypes.string.isRequired,
  questionId: PropTypes.number.isRequired,
  color: PropTypes.array.isRequired,
  selectedAnswer: PropTypes.bool.isRequired,
  playedSound: PropTypes.bool.isRequired
};

export default Instruction;
