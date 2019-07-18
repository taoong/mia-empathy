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

  setParticipantGender = event => {
    this.setState({ participantGender: event.target.value });
  };

  setParticipantOtherGender = event => {
    this.setState({ participantOtherGender: event.target.value });
  };

  setParticipantRace = event => {
    this.setState({ participantRace: event.target.value });
  };

  setParticipantOtherRace = event => {
    this.setState({ participantOtherRace: event.target.value });
  };

  setParticipantAge = event => {
    this.setState({ participantAge: event.target.value });
  };

  setParticipantZipcode = event => {
    this.setState({ participantZipcode: event.target.value });
  };

  setParticipantEmail = event => {
    this.setState({ participantEmail: event.target.value });
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
    if (
      !this.state.participantFirstName ||
      !this.state.participantLastName ||
      !this.state.participantEmail ||
      !this.state.participantAge ||
      !this.state.participantGender ||
      !this.state.participantRace ||
      !this.state.participantZipcode
    ) {
      alert("All form fields must be filled out!");
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

    this.setState(prevState => ({
      participants: [...prevState.participants, newParticipant],
      participantId: prevState.participantId + 1,
      participantFirstName: "",
      participantLastName: "",
      participantEmail: "",
      participantAge: "",
      participantGender: "",
      participantRace: "",
      participantZipcode: ""
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
                type="number"
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
