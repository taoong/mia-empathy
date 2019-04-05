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

  componentDidUpdate() {
    //this.updateImage();
  }

  componentDidMount() {
    //this.updateImage();
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
    // TODO: Handle perspective question types using props.questionContent
    if (type !== "perspective") {
      let questionType = type.split("-")[0];
      let answerType = type.split("-")[1];
      return (
        <h3>
          select the <strong style={{ color: color[0] }}>{answerType}</strong>{" "}
          that best matches the{" "}
          <strong style={{ color: color[0] }}>{questionType}</strong>
        </h3>
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
        {this.props.imageUrl ? (
          <img src={require("../../" + this.props.imageUrl)} alt="Not found!" />
        ) : null}
      </div>
    );
  }
}

Question.propTypes = {
  questionContent: PropTypes.string.isRequired,
  questionType: PropTypes.string.isRequired,
  questionId: PropTypes.number.isRequired,
  imageUrl: PropTypes.string.isRequired,
  color: PropTypes.array.isRequired
};

export default Question;
