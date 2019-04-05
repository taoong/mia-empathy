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

  randomColor() {
    let colors = [
      ["#DE405D", "#E58FA0"],
      ["#2848D0", "#A7D8ED"],
      ["#489630", "#B7DC56"],
      ["#EF7F3A", "#F8CD76"],
      ["#FBE14C", "#FCEE98"]
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  formatQuestion = (type, question, color) => {
    // TODO: Handle perspective question types using props.questionContent
    if (type !== "perspective") {
      let questionType = type.split("-")[0];
      let answerType = type.split("-")[1];
      return (
        <h2>
          Match the <strong style={{ color: color[0] }}>{answerType}</strong> to
          the <strong style={{ color: color[0] }}>{questionType}</strong>
        </h2>
      );
    }
  };

  render() {
    return (
      <div className="question">
        {this.formatQuestion(
          this.props.questionType,
          this.props.questionContent,
          this.randomColor()
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
  imageUrl: PropTypes.string.isRequired
};

export default Question;
