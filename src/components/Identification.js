import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "../Firebase";

class Identification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: "",
      quizType: ""
    };
    this.users = firebase.firestore().collection("users");
  }

  setQuizType = event => {
    this.setState({ quizType: event.target.value });
  };

  setUserId = event => {
    this.setState({ userId: event.target.value });
  };

  handleSubmit = () => {
    let currentComponent = this;
    if (!this.state.userId) {
      alert("User ID input can't be blank!");
    } else if (!this.state.quizType) {
      alert("Before/after input can't be blank!");
    } else {
      let userRef = this.users.doc(this.state.userId);
      userRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            currentComponent.props.setUserId(currentComponent.state.userId);
            currentComponent.props.setQuizType(currentComponent.state.quizType);
          } else {
            alert("User ID doesn't exist");
          }
        })
        .catch(function(error) {
          console.log("Error getting User ID:", error);
          alert("Error getting User ID");
        });
    }
  };

  render() {
    return (
      <div className="identification card-form">
        <div className="intro">
          <h2>Sign in</h2>
          <h4>to start the quiz</h4>
        </div>
        <div className="radioButtons">
          <label>Before Exhibit</label>
          <input
            type="radio"
            name="quiztype"
            value="pre"
            onChange={this.setQuizType}
          />
          <label>After Exhibit</label>
          <input
            type="radio"
            name="quiztype"
            value="post"
            onChange={this.setQuizType}
          />
        </div>
        <h4 className="id">User ID:</h4>
        <input
          type="text"
          value={this.state.userId}
          onChange={this.setUserId}
        />
        <button className="button" onClick={this.handleSubmit}>
          Start Quiz
        </button>
      </div>
    );
  }
}

Identification.propTypes = {
  setUserId: PropTypes.func.isRequired,
  setQuizType: PropTypes.func.isRequired
};

export default Identification;
