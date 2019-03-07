import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "../Firebase";

class Identification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      participantId: "",
      quizType: ""
    };
    this.participants = firebase.firestore().collection("participants");
  }

  setQuizType = event => {
    this.setState({ quizType: event.target.value });
  };

  setParticipantId = event => {
    this.setState({ participantId: event.target.value });
  };

  handleSubmit = () => {
    let currentComponent = this;
    if (!this.state.participantId) {
      alert("Participant ID input can't be blank!");
    } else if (!this.state.quizType) {
      alert("Before/after input can't be blank!");
    } else {
      let participantRef = this.participants.doc(this.state.participantId);
      participantRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            currentComponent.props.setParticipantId(
              currentComponent.state.participantId
            );
            currentComponent.props.setQuizType(currentComponent.state.quizType);
          } else {
            alert("Participant ID doesn't exist");
          }
        })
        .catch(function(error) {
          console.log("Error getting Participant ID:", error);
          alert("Error getting Participant ID");
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
        <h4 className="id">Participant ID:</h4>
        <input
          type="text"
          value={this.state.participantId}
          onChange={this.setParticipantId}
        />
        <button className="button" onClick={this.handleSubmit}>
          Start Quiz
        </button>
      </div>
    );
  }
}

Identification.propTypes = {
  setParticipantId: PropTypes.func.isRequired,
  setQuizType: PropTypes.func.isRequired
};

export default Identification;
