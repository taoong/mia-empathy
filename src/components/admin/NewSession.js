import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import firebase from "../../Firebase";
import Modal from "../other/Modal";
import Participant from "./Participant";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class NewSession extends Component {
  state = {
    sessionName: "",
    type: "",
    quiz: "",
    datetime: new Date(),
    participants: [],
    showParticipantModal: false,
    showDeleteModal: false,
    participantKey: null,
    participantId: 1,
    participantFirstName: "",
    participantLastName: "",
    participantGender: "",
    participantOtherGender: "",
    participantRace: "",
    participantOtherRace: "",
    participantAge: "",
    participantZipcode: "",
    participantEmail: "",
    goBack: false,
    originalParticipants: [],
    quizIds: []
  };
  sessionRef = firebase
    .firestore()
    .collection("sessions")
    .doc();
  quizzesRef = firebase.firestore().collection("quizzes");

  /**
   * Fetches data if editing an existing session.
   */
  componentDidMount = () => {
    if (this.props.match.params.id) {
      this.sessionRef = firebase
        .firestore()
        .collection("sessions")
        .doc(this.props.match.params.id);
      this.fetchSessionData();
    }
    this.fetchQuizzes();
  };

  /**
   * Fetches existing session data from Firebase.
   */
  fetchSessionData = () => {
    let currentComponent = this;
    this.sessionRef
      .get()
      .then(doc => {
        currentComponent.setState({
          sessionName: doc.data().sessionName,
          type: doc.data().type,
          quiz: doc.data().quiz,
          datetime: doc.data().datetime.toDate(),
          participants: doc.data().participants,
          participantId: doc.data().participants.length + 1
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  /**
   * Fetches and stores quiz IDs in state to assign to sessions.
   */
  fetchQuizzes = () => {
    const currentComponent = this;
    this.quizzesRef
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          currentComponent.setState(prevState => ({
            quizIds: [...prevState.quizIds, doc.id]
          }));
        });
      })
      .catch(error => {
        console.log("Error getting documents: ", error);
      });
  };

  /**
   * Event handler that updates state with the session's name.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setSessionName = event => {
    this.setState({ sessionName: event.target.value });
  };

  /**
   * Event handler that updates state with the session's type (adult/child).
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setType = event => {
    this.setState({ type: event.target.value });
  };

  /**
   * Event handler that updates state with the session's quiz ID.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setQuiz = event => {
    this.setState({ quiz: event.target.value });
  };

  /**
   * Event handler that updates state with the session's datetime.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setDatetime = datetime => {
    this.setState({ datetime: datetime });
  };

  /**
   * Event handler that updates state with a new participant's first name.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setParticipantFirstName = event => {
    this.setState({ participantFirstName: event.target.value });
  };

  /**
   * Event handler that updates state with a new participant's last name.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setParticipantLastName = event => {
    this.setState({ participantLastName: event.target.value });
  };

  /**
   * Event handler that updates state with a new participant's gender.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setParticipantGender = event => {
    this.setState({ participantGender: event.target.value });
  };

  /**
   * Event handler that updates state with a new participant's gender if an "other" gender was inputted.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setParticipantOtherGender = event => {
    this.setState({ participantOtherGender: event.target.value });
  };

  /**
   * Event handler that updates state with a new participant's race.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setParticipantRace = event => {
    this.setState({ participantRace: event.target.value });
  };

  /**
   * Event handler that updates state with a new participant's race if an "other" race was inputted.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setParticipantOtherRace = event => {
    this.setState({ participantOtherRace: event.target.value });
  };

  /**
   * Event handler that updates state with a new participant's age.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setParticipantAge = event => {
    this.setState({ participantAge: event.target.value });
  };

  /**
   * Event handler that updates state with a new participant's zipcode.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setParticipantZipcode = event => {
    this.setState({ participantZipcode: event.target.value });
  };

  /**
   * Event handler that updates state with a new participant's email.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setParticipantEmail = event => {
    this.setState({ participantEmail: event.target.value });
  };

  /**
   * Shows the modal to add a new participant.
   */
  showParticipantModal = () => {
    this.setState({ showParticipantModal: true });
  };

  /**
   * Hides the modal to add a new participant.
   */
  hideParticipantModal = () => {
    this.setState({
      showParticipantModal: false,
      participantKey: null,
      participantId: this.getLatestId()
    });
  };

  /**
   * Shows the modal to confirm deleting the session.
   */
  showDeleteModal = () => {
    this.setState({ showDeleteModal: true });
  };

  /**
   * Hides the modal to confirm deleting the session.
   */
  hideDeleteModal = () => {
    this.setState({ showDeleteModal: false });
  };

  /**
   * Creates a 3 digit ID string by prepending 0s to a unique number.
   * @param {number} id - A number from 1 to 99.
   * @returns {string} The 3 digit stringified number with prepended 0s.
   */
  processId(id) {
    id = "00" + id.toString();
    let length = id.length;
    id = id.substring(length - 3, length);
    return id;
  }

  /**
   * Adds a new participant to the session.
   */
  addParticipant = () => {
    // Checks that all necessary form fields are filled in
    if (!this.state.participantFirstName || !this.state.participantLastName) {
      alert("First and last name form fields must be filled out!");
      return;
    }

    // Getting other gender input if there is a need to specify
    let gender =
      this.state.participantGender === "other"
        ? this.state.participantOtherGender
        : this.state.participantGender;

    // Getting other race input if there is a need to specify
    let race =
      this.state.participantRace === "other"
        ? this.state.participantOtherRace
        : this.state.participantRace;

    let newParticipant = {
      id: this.processId(this.state.participantId),
      firstname: this.state.participantFirstName,
      lastname: this.state.participantLastName,
      email: this.state.participantEmail,
      age: this.state.participantAge,
      gender: gender,
      race: race,
      zipcode: this.state.participantZipcode,
      session: this.sessionRef.id
    };

    let modifyParticipants = new Promise((resolve, reject) => {
      if (this.state.participantKey != null) {
        this.setState(state => {
          const participants = state.participants.map((item, j) => {
            if (j === this.state.participantKey) {
              return newParticipant;
            } else {
              return item;
            }
          });
          return {
            participants
          };
        });
      } else {
        this.setState(prevState => ({
          participants: [...prevState.participants, newParticipant]
        }));
      }
      resolve();
    });

    // Resetting participant input values
    modifyParticipants.then(() => {
      this.setState(prevState => ({
        participantKey: null,
        participantId: this.getLatestId(),
        participantFirstName: "",
        participantLastName: "",
        participantEmail: "",
        participantAge: "",
        participantGender: "",
        participantRace: "",
        participantZipcode: ""
      }));
      this.hideParticipantModal();
      console.log(this.getLatestId());
    });
  };

  editParticipant = id => {
    let participant = this.state.participants[id];
    this.setState({
      participantKey: id,
      participantId: parseInt(participant.id),
      participantFirstName: participant.firstname,
      participantLastName: participant.lastname,
      participantEmail: participant.email,
      participantAge: participant.age,
      participantGender: participant.gender,
      participantRace: participant.race,
      participantZipcode: participant.zipcode
    });
    this.showParticipantModal();
  };

  /**
   * Deletes a participant.
   * @param {number} id - The ID of the participant to delete.
   */
  deleteParticipant = id => {
    var newArray = [...this.state.participants];
    newArray = newArray.filter(p => p.id !== id);
    var newId = 1;
    newArray.forEach(participant => {
      participant.id = this.processId(newId);
      newId += 1;
    });
    this.setState({
      participants: newArray,
      participantKey: null,
      participantId: newId
    });
  };

  getLatestId = () => {
    var newId = 1;
    this.state.participants.forEach(participant => {
      newId += 1;
    });
    return newId;
  };

  /**
   * Submit the form to add or update a session.
   */
  addSession = () => {
    // Checks that all necessary form fields were filled in
    if (
      !this.state.sessionName ||
      !this.state.type ||
      !this.state.quiz ||
      !this.state.datetime
    ) {
      alert("All form fields must be filled out!");
      return;
    }
    const currentComponent = this;
    this.sessionRef
      .set({
        sessionName: currentComponent.state.sessionName,
        type: currentComponent.state.type,
        quiz: currentComponent.state.quiz,
        datetime: currentComponent.state.datetime,
        participants: currentComponent.state.participants
      })
      .then(() => {
        // Show the appropriate alert
        currentComponent.props.match.params.id
          ? alert("Session updated!")
          : alert("Session added!");
        // Used to redirect to the quizzes tab
        currentComponent.setState({ goBack: true });
      })
      .catch(error => {
        console.error("Error writing document: ", error);
      });
  };

  /**
   * Deletes the quiz.
   */
  deleteSession = () => {
    let currentComponent = this;
    this.hideDeleteModal();
    this.sessionRef
      .delete()
      .then(() => {
        alert("Session deleted!");
        // Redirects back to the sessions tab
        currentComponent.setState({ goBack: true });
      })
      .catch(error => {
        alert("Error deleting session: ", error);
      });
  };

  /**
   * Renders the new session screen.
   * @returns {JSX} The new/update session screen.
   */
  render() {
    // All existing participants in the session
    const participants = this.state.participants.map((p, key) => (
      <div className="participant" key={key}>
        <div className="content" onClick={() => this.editParticipant(key)}>
          <Participant id={p.id} name={p.firstname + " " + p.lastname} />
        </div>
        <button
          className="close-button"
          onClick={() => this.deleteParticipant(p.id)}
        >
          &#10005;
        </button>
      </div>
    ));

    // IDs of all existing quizzes
    const quizIds = this.state.quizIds.map((id, index) => (
      <option key={index} value={id}>
        {id}
      </option>
    ));

    // Used to redirect back to the sessions tab
    if (this.state.goBack === true) {
      return (
        <Redirect
          to={this.props.match.params.id ? "../../sessions" : "../sessions"}
        />
      );
    }

    return (
      <div className="new-form">
        <div className="header-div">
          <h1>{this.props.match.params.id ? "Edit" : "New"} Session</h1>
          {this.props.match.params.id ? (
            <i
              className="fa fa-trash-o delete-button"
              onClick={this.showDeleteModal}
            />
          ) : null}
        </div>
        <div className="form-field-container">
          <div className="form-left">
            <h4 className="form-label">Session Name</h4>
            <input
              type="text"
              value={this.state.sessionName}
              onChange={this.setSessionName}
            />

            <h4 className="form-label">Type</h4>
            <select name="type" value={this.state.type} onChange={this.setType}>
              <option value="" style={{ display: "none" }} />
              <option value="adult">Adult</option>
              <option value="child">Child</option>
            </select>

            <h4 className="form-label">Quiz</h4>
            <select name="quiz" value={this.state.quiz} onChange={this.setQuiz}>
              <option value="" style={{ display: "none" }} />
              {quizIds}
            </select>

            <h4 className="form-label">Date and Time</h4>
            <DatePicker
              selected={this.state.datetime}
              onChange={this.setDatetime}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              timeCaption="time"
            />

            <button className="button" onClick={this.addSession}>
              {this.props.match.params.id ? "Update" : "Add"} Session
            </button>
          </div>
          <div className="form-right">
            <div className="header-div">
              <h4 className="form-label">
                Participants ({participants.length})
              </h4>
              <button
                className="add-button"
                onClick={this.showParticipantModal}
              >
                &#10010;
              </button>
            </div>
            {participants}
          </div>
        </div>
        <Modal
          show={this.state.showParticipantModal}
          handleClose={this.hideParticipantModal}
          handleSubmit={this.addParticipant}
          submitText={"Submit"}
        >
          <h2>Add Participant</h2>
          <div className="form-field-container">
            <div className="form-left secondary">
              <h4 className="form-label">First Name</h4>
              <input
                type="text"
                value={this.state.participantFirstName}
                onChange={this.setParticipantFirstName}
              />
            </div>
            <div className="form-left secondary">
              <h4 className="form-label">Last Name</h4>
              <input
                type="text"
                value={this.state.participantLastName}
                onChange={this.setParticipantLastName}
              />
            </div>
          </div>

          <div className="form-field-container">
            <div className="form-left secondary">
              <h4 className="form-label">Gender</h4>
              <select
                name="type"
                value={this.state.participantGender}
                onChange={this.setParticipantGender}
              >
                <option value="" style={{ display: "none" }} />
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="nonbinary">Nonbinary</option>
                <option value="other">
                  Different identity (please specify)
                </option>
              </select>
            </div>
            {this.state.participantGender === "other" ? (
              <div className="form-left secondary other">
                <h4 className="form-label">Other gender</h4>
                <input
                  type="text"
                  value={this.state.participantOtherGender}
                  onChange={this.setParticipantOtherGender}
                />
              </div>
            ) : (
              <div />
            )}
          </div>

          <div className="form-field-container">
            <div className="form-left secondary">
              <h4 className="form-label">Race/Ethnicity</h4>
              <select
                name="type"
                value={this.state.participantRace}
                onChange={this.setParticipantRace}
              >
                <option value="" style={{ display: "none" }} />
                <option value="white">White/Caucasian</option>
                <option value="black">Black/African-American</option>
                <option value="hispanic">Hispanic</option>
                <option value="latinx">Latino/a</option>
                <option value="east asian">
                  East Asian (e.g., Chinese, Japanese, Vietnamese)
                </option>
                <option value="south asian">
                  South Asian (e.g., Indian, Pakistani, Burmese)
                </option>
                <option value="american indian">
                  American Indian or Alaskan Native
                </option>
                <option value="pacific islander">
                  Pacific Islander or Native Hawaiian
                </option>
                <option value="other">
                  Not listed here or prefer to self-describe
                </option>
              </select>
            </div>
            {this.state.participantRace === "other" ? (
              <div className="form-left secondary other">
                <h4 className="form-label">Other race</h4>
                <input
                  type="text"
                  value={this.state.participantOtherRace}
                  onChange={this.setParticipantOtherRace}
                />
              </div>
            ) : (
              <div />
            )}
          </div>

          <div className="form-field-container">
            <div className="form-left secondary">
              <h4 className="form-label">Age</h4>
              <input
                type="number"
                value={this.state.participantAge}
                onChange={this.setParticipantAge}
              />
            </div>
            <div className="form-left secondary">
              <h4 className="form-label">Zip code</h4>
              <input
                type="text"
                value={this.state.zipcode}
                onChange={this.setParticipantZipcode}
              />
            </div>
          </div>

          <div className="form-field-container">
            <div className="form-left secondary">
              <h4 className="form-label">Email</h4>
              <input
                type="email"
                value={this.state.participantEmail}
                onChange={this.setParticipantEmail}
              />
            </div>
          </div>
        </Modal>
        <Modal
          show={this.state.showDeleteModal}
          handleClose={this.hideDeleteModal}
          handleSubmit={this.deleteSession}
          submitText={"Delete Session"}
        >
          <h3>Are you sure you want to delete this session?</h3>
          <h5>This action cannot be undone.</h5>
        </Modal>
      </div>
    );
  }
}
export default NewSession;
