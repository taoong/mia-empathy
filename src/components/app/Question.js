import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "../../Firebase";

class Question extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUrl: ""
    };
    this.storageRef = firebase.storage().ref();
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
      return (
        <h3>
          select the{" "}
          <strong style={{ color: color[0] }}> facial expression </strong> that
          best matches the
          <strong style={{ color: color[0] }}> voice </strong>
        </h3>
      );
    } else if (type === "face-voice") {
      return (
        <h3>
          select the <strong style={{ color: color[0] }}> voice </strong> that
          best matches the
          <strong style={{ color: color[0] }}> facial expression </strong>
        </h3>
      );
    } else if (type === "illustration-face") {
      return (
        <h3>
          select the{" "}
          <strong style={{ color: color[0] }}> facial expression </strong> that
          best matches the
          <strong style={{ color: color[0] }}> drawing </strong>
        </h3>
      );
    } else if (type === "illustration-voice") {
      return (
        <h3>
          select the <strong style={{ color: color[0] }}> voice </strong> that
          best matches the
          <strong style={{ color: color[0] }}> drawing </strong>
        </h3>
      );
    } else if (type === "story-face") {
      return (
        <div>
          <h3>
            select the{" "}
            <strong style={{ color: color[0] }}> facial expression </strong>{" "}
            that best matches the
            <strong style={{ color: color[0] }}> story </strong>
          </h3>
        </div>
      );
    } else if (type === "story-voice") {
      return (
        <div>
          <h3>
            select the <strong style={{ color: color[0] }}> voice </strong> that
            best matches the
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
  color: PropTypes.array.isRequired
};

export default Question;
