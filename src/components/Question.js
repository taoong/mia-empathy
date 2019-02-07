import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "../Firebase";

class Question extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUrl: ""
    };
    this.storageRef = firebase.storage().ref();
  }

  componentDidUpdate() {
    this.updateImage();
  }

  componentDidMount() {
    this.updateImage();
  }

  updateImage() {
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

  render() {
    return (
      <div className="question">
        <h2>{this.props.questionContent}</h2>
        {this.state.imageUrl ? (
          <img src={this.state.imageUrl} alt="Not found!" />
        ) : null}
      </div>
    );
  }
}

Question.propTypes = {
  questionContent: PropTypes.string.isRequired,
  questionId: PropTypes.number.isRequired,
  imageUrl: PropTypes.string.isRequired
};

export default Question;
