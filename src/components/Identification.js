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

    this.participantsRef = firebase.firestore().collection("participants");
    this.responsesRef = firebase.firestore().collection("responses");
    this.sessionsRef = firebase.firestore().collection("sessions");
  }

  setQuizType = event => {
    this.setState({ quizType: event.target.value });
  };

  setParticipantId = event => {
    this.setState({ participantId: event.target.value });
  };

  getDateTime(timestamp) {
    const date = timestamp.toDate();
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  handleSubmit = () => {
    if (!this.state.participantId) {
      alert("Participant ID input can't be blank!");
    } else if (!this.state.quizType) {
      alert("Before/after input can't be blank!");
    } else {
      var participant = null;
      let promise = new Promise((resolve, reject) => {
        this.props.session.data().participants.forEach(p => {
          if (p.id === this.state.participantId) {
            participant = p;
            resolve();
          }
        });
        reject();
      });
      promise
        .then(() => {
          if (this.state.quizType === "post") {
            let responseRef = this.responsesRef.doc(
              this.props.session.id + this.state.participantId
            );
            responseRef
              .get()
              .then(doc => {
                if (doc.data().pre) {
                  this.props.setParticipant(participant);
                  this.props.setQuizType(this.state.quizType);
                }
              })
              .catch(() => {
                alert(
                  "This Participant ID hasn't completed the before exhibit test yet!"
                );
                return;
              });
          } else {
            this.props.setParticipant(participant);
            this.props.setQuizType(this.state.quizType);
          }
        })
        .catch(() => {
          alert("This Participant ID doesn't exist!");
        });
    }
  };

  renderSessionDetails = () => {
    var session = null;
    if (this.props.session) {
      session = this.props.session.data();
    }

    return (
      <div>
        <h2>
          {this.props.session ? session.organization : "Loading session..."}
        </h2>
        <h4>
          {this.props.session ? this.getDateTime(session.datetime) : <br />}
        </h4>
      </div>
    );
  };

  render() {
    return (
      <div className="identification card-form">
        <div className="intro">{this.renderSessionDetails()}</div>
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
  setParticipant: PropTypes.func.isRequired,
  setQuizType: PropTypes.func.isRequired
};

export default Identification;
