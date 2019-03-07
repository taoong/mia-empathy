import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import firebase from "../Firebase";
import Modal from "./Modal";
import Participant from "./Participant";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class NewSession extends Component {
  state = {
    organization: "",
    type: "",
    datetime: new Date(),
    participants: [],
    showParticipantModal: false,
    participantId: 1,
    participantFirstName: "",
    participantLastName: "",
    participantAge: "",
    participantGender: "",
    participantRace: "",
    goBack: false
  };
  newSessionRef = firebase
    .firestore()
    .collection("sessions")
    .doc();

  componentDidMount = () => {};

  setOrganization = event => {
    this.setState({ organization: event.target.value });
  };

  setType = event => {
    this.setState({ type: event.target.value });
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

  setParticipantAge = event => {
    this.setState({ participantAge: event.target.value });
  };

  setParticipantGender = event => {
    this.setState({ participantGender: event.target.value });
  };

  setParticipantRace = event => {
    this.setState({ participantRace: event.target.value });
  };

  showModal = () => {
    this.setState({ showParticipantModal: true });
  };

  hideModal = () => {
    this.setState({ showParticipantModal: false });
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
      !this.state.participantAge ||
      !this.state.participantGender ||
      !this.state.participantRace
    ) {
      alert("All form fields must be filled out!");
      return;
    }

    let newParticipant = {
      id: this.processId(this.state.participantId),
      firstname: this.state.participantFirstName,
      lastname: this.state.participantLastName,
      age: this.state.participantAge,
      gender: this.state.participantGender,
      race: this.state.participantRace
    };

    this.setState(prevState => ({
      participants: [...prevState.participants, newParticipant],
      participantId: prevState.participantId + 1,
      participantFirstName: "",
      participantLastName: "",
      participantAge: "",
      participantGender: "",
      participantRace: ""
    }));

    this.hideModal();
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
    if (!this.state.organization || !this.state.type || !this.state.datetime) {
      alert("All form fields must be filled out!");
      return;
    }
    const currentComponent = this;
    this.newSessionRef
      .set({
        organization: currentComponent.state.organization,
        type: currentComponent.state.type,
        datetime: currentComponent.state.datetime,
        participants: currentComponent.state.participants
      })
      .then(function() {
        alert("Session added!");
        currentComponent.setState({ goBack: true });
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
  };

  render() {
    const participants = this.state.participants.map((p, key) => (
      <Participant
        key={key}
        id={p.id}
        name={p.firstname + " " + p.lastname}
        age={p.age}
        delete={this.deleteParticipant}
      />
    ));

    if (this.state.goBack === true) {
      return <Redirect to="../sessions" />;
    }

    return (
      <div className="new-form">
        <div className="header-div">
          <h1>New Session</h1>
        </div>
        <div className="form-field-container">
          <div className="form-left">
            <h4 className="form-label">Organization Name</h4>
            <input
              type="text"
              value={this.state.organization}
              onChange={this.setOrganization}
            />
            <h4 className="form-label">Type</h4>
            <select name="type" value={this.state.type} onChange={this.setType}>
              <option value="" style={{ display: "none" }} />
              <option value="adult">Adult</option>
              <option value="child">Child</option>
              <option value="mixed">Mixed</option>
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
          </div>
          <div className="form-right">
            <div className="header-div">
              <h4 className="form-label">
                Participants ({participants.length})
              </h4>
              <button className="add-button" onClick={this.showModal}>
                &#10010;
              </button>
            </div>
            {participants}
          </div>
        </div>
        <button className="button" onClick={this.addSession}>
          Add Session
        </button>
        <Modal
          show={this.state.showParticipantModal}
          handleClose={this.hideModal}
          handleSubmit={this.addParticipant}
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
              <h4 className="form-label">Age</h4>
              <input
                type="number"
                value={this.state.participantAge}
                onChange={this.setParticipantAge}
              />
            </div>
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
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <h4 className="form-label">Race</h4>
          <select
            name="type"
            value={this.state.participantRace}
            onChange={this.setParticipantRace}
          >
            <option value="" style={{ display: "none" }} />
            <option value="hispanic">Hispanic/Latino</option>
            <option value="white">White (not Hispanic/Latino)</option>
            <option value="black">Black or African American</option>
            <option value="pacific islander">
              Native Hawaiian or Other Pacific Islander
            </option>
            <option value="asian">Asian</option>
            <option value="american indian">
              American Indian or Alaskan Native
            </option>
            <option value="two or more">Two or More Races</option>
          </select>
        </Modal>
      </div>
    );
  }
}
export default NewSession;
