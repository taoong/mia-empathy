import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "../../Firebase";

class Identification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      participantId: "",
      quizType: "",
      kiosk: false
    };

    this.participantsRef = firebase.firestore().collection("participants");
    this.responsesRef = firebase.firestore().collection("responses");
    this.sessionsRef = firebase.firestore().collection("sessions");
  }

  /**
   * Event handler that updates state with the quiz type.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setQuizType = event => {
    this.setState({ quizType: event.target.value });
  };

  /**
   * Event handler that updates state with the participant's ID.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setParticipantId = event => {
    this.setState({ participantId: event.target.value });
  };

  /**
   * Converts a timestamp object into a readable datetime string.
   * @param {Object} timestamp - A Javascript Date object representing a timestamp.
   * @returns {string} A readable datetime string in en-US format (e.g. August 1, 2019, 10:59 AM).
   */
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

  /**
   * Changes to or from a kiosk user form.
   */
  changeType = () => {
    // Make sure that the current session has been loaded.
    if (this.props.session) {
      this.restartForm();
      this.setState({ kiosk: !this.state.kiosk });
    }
  };

  /**
   * Resets all form inputs.
   */
  restartForm = () => {
    this.setState({
      participantId: "",
      quizType: ""
    });
  };

  /**
   * Generates a participant ID for kiosk participants who haven't been assigned an ID yet.
   * @returns {string} A unique participant ID.
   */
  async generateId() {
    var session = null;
    if (this.props.session) {
      session = this.props.session.data();

      // Counting all ids
      var count = 0;
      session.participants.forEach(participant => {
        count += 1;
      });
      console.log("hi2");
      // Get the next biggest number and prepend 0's if necessary
      var id = count + 1;
      id = "00" + id.toString();
      let length = id.length;
      id = id.substring(length - 3, length);

      return id;
    } else {
      return "001";
    }
  }

  /**
   * Verifies the inputted participant ID and quiz type, and starts the quiz if everything looks right.
   */
  handleSubmit = () => {
    // Makes sure a participant ID was inputted
    if (!this.state.participantId) {
      alert("Participant ID input can't be blank!");
    }

    // Makes sure a quiz type was selected
    else if (!this.state.quizType) {
      alert("Before/after input can't be blank!");
    } else {
      // Create a variable to point to if the inputted ID was found
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
      // If the participant ID was found, start the quiz and update the parent component state appropriately
      promise
        .then(() => {
          // If the quizType is "post", make sure that the participant has already completed the "pre" test
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
              // Don't let the quiz start if the "pre" test wasn't completed
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
        // Don't let the quiz start if the participant ID is invalid
        .catch(() => {
          alert("This Participant ID doesn't exist!");
        });
    }
  };

  /**
   * Renders the name and datetime of the most recent session.
   * @returns {JSX} The name and datetime of the most recent session.
   */
  renderSessionDetails = () => {
    var session = null;
    if (this.props.session) {
      session = this.props.session.data();
    }

    return (
      <div>
        <h2>
          {this.props.session ? session.sessionName : "Loading session..."}
        </h2>
        <h4>
          {this.props.session ? this.getDateTime(session.datetime) : <br />}
        </h4>
      </div>
    );
  };

  /**
   * Renders the identification form for non-kiosk participants.
   * @returns {JSX} Identification form for non-kiosk participants.
   */
  renderSessionIdentification = () => {
    return (
      <div>
        <div className="intro">{this.renderSessionDetails()}</div>
        <div className="radioButtons">
          <label>Before</label>
          <input
            type="radio"
            name="quiztype"
            value="pre"
            onChange={this.setQuizType}
          />
          <label>After</label>
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
        <button className="link" onClick={this.changeType}>
          Click here if you are not with a group or have not received a
          participant ID
        </button>
        <button className="button" onClick={this.handleSubmit}>
          Start Quiz
        </button>
      </div>
    );
  };

  /**
   * Renders the identification form for kiosk participants.
   * @returns {JSX} Identification form for kiosk participants.
   */
  renderKioskIdentification = () => {
    if (this.state.participantId === "") {
      this.generateId().then(id => {
        this.setState({ participantId: id });
      });
    }

    return (
      <div>
        <h4 className="id">Participant ID:</h4>
        <input type="text" value={this.state.participantId} disabled />
        <button className="link" onClick={this.changeType}>
          Click here if you are a part of a group tour or have a participant ID
        </button>
        <button className="button" onClick={this.handleSubmit}>
          Start Quiz
        </button>
      </div>
    );
  };

  /**
   * Renders the Identification component.
   * @returns {JSX} The Identification component.
   */
  render() {
    return (
      <div id="identification" className="card-form">
        {this.state.kiosk
          ? this.renderKioskIdentification()
          : this.renderSessionIdentification()}
      </div>
    );
  }
}

/**
 * Props passed down from the App component.
 */
Identification.propTypes = {
  setParticipant: PropTypes.func.isRequired,
  setQuizType: PropTypes.func.isRequired
};

export default Identification;
