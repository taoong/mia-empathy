import React, { Component } from "react";
import PropTypes from "prop-types";

class Question extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUrl: ""
    };
    // this.storageRef = firebase.storage().ref();
  }

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

  formatQuestion = (type, question, color) => {
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

  render() {
    return (
      <div className="question">
        {this.formatQuestion(
          this.props.questionType,
          this.props.questionContent,
          this.props.color
        )}
      </div>
    );
  }
}

Question.propTypes = {
  questionContent: PropTypes.string.isRequired,
  questionType: PropTypes.string.isRequired,
  questionId: PropTypes.number.isRequired,
  color: PropTypes.array.isRequired,
  selectedAnswer: PropTypes.bool.isRequired,
  playedSound: PropTypes.bool.isRequired
};

export default Question;
