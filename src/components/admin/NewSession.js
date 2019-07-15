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
    participantId: 1,
    participantFirstName: "",
    participantLastName: "",
    goBack: false,
    originalParticipants: [],
    quizIds: []
  };
  sessionRef = firebase
    .firestore()
    .collection("sessions")
    .doc();
  quizzesRef = firebase.firestore().collection("quizzes");

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

  fetchQuizzes = () => {
    // var quizzes = [];
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

  setSessionName = event => {
    this.setState({ sessionName: event.target.value });
  };

  setType = event => {
    this.setState({ type: event.target.value });
  };

  setQuiz = event => {
    this.setState({ quiz: event.target.value });
  };

  setDatetime = datetime => {
    this.setState({ datetime: datetime });
  };

  setParticipantFirstName = event => {
    this.setState({ participantFirstName: event.target.value });
  };

  setParticipantLastName = event => {
    this.setState({ participantLastName: event.target.value });
  };

  showParticipantModal = () => {
    this.setState({ showParticipantModal: true });
  };

  hideParticipantModal = () => {
    this.setState({ showParticipantModal: false });
  };

  showDeleteModal = () => {
    this.setState({ showDeleteModal: true });
  };

  hideDeleteModal = () => {
    this.setState({ showDeleteModal: false });
  };

  processId(id) {
    id = "00" + id.toString();
    let length = id.length;
    id = id.substring(length - 3, length);
    return id;
  }

  addParticipant = () => {
    if (!this.state.participantFirstName || !this.state.participantLastName) {
      alert("All form fields must be filled out!");
      return;
    }

    let newParticipant = {
      id: this.processId(this.state.participantId),
      firstname: this.state.participantFirstName,
      lastname: this.state.participantLastName,
      session: this.sessionRef.id
    };

    this.setState(prevState => ({
      participants: [...prevState.participants, newParticipant],
      participantId: prevState.participantId + 1,
      participantFirstName: "",
      participantLastName: ""
    }));

    this.hideParticipantModal();
  };

  deleteParticipant = id => {
    var newArray = [...this.state.participants];
    newArray = newArray.filter(p => p.id !== id);
    var newId = 1;
    newArray.forEach(participant => {
      participant.id = this.processId(newId);
      newId += 1;
    });
    this.setState({ participants: newArray, participantId: newId });
  };

  addSession = () => {
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
      .then(function() {
        currentComponent.props.match.params.id
          ? alert("Session updated!")
          : alert("Session added!");
        currentComponent.setState({ goBack: true });
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
  };

  deleteSession = () => {
    let currentComponent = this;
    this.hideDeleteModal();
    this.sessionRef
      .delete()
      .then(() => {
        alert("Session deleted!");
        currentComponent.setState({ goBack: true });
      })
      .catch(error => {
        alert("Error deleting session: ", error);
      });
  };

  render() {
    const participants = this.state.participants.map((p, key) => (
      <Participant
        key={key}
        id={p.id}
        name={p.firstname + " " + p.lastname}
        delete={this.deleteParticipant}
      />
    ));

    const quizIds = this.state.quizIds.map((id, index) => (
      <option key={index} value={id}>
        {id}
      </option>
    ));

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
              <option value="mixed">Mixed</option>
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
