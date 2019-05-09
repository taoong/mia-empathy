import React, { Component } from "react";
import firebase from "../../Firebase";

class Checkin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      age: "",
      firstName: "",
      lastName: "",
      gender: "",
      race: "",
      page: 1,
      finished: false
    };

    this.participantsRef = firebase.firestore().collection("participants");
    this.responsesRef = firebase.firestore().collection("responses");
    this.sessionsRef = firebase.firestore().collection("sessions");
  }

  setId = event => {
    this.setState({ id: event.target.value });
  };

  setAge = event => {
    let age = event.target.value < 113 ? event.target.value : 113;
    this.setState({ age: age });
  };

  setGender = event => {
    this.setState({ gender: event.target.value });
  };

  setRace = event => {
    this.setState({ race: event.target.value });
  };

  restartForm = () => {
    this.setState({ page: 1 });
  };

  handleNext = () => {
    if (!this.state.id) {
      alert("Participant ID input can't be blank!");
    } else {
      this.setState({ page: 2 });
    }
  };

  handleSubmit = () => {
    this.setState({ page: 3 });
  };

  renderPage1 = () => {
    return (
      <div>
        <h2>MIA Empathy Tool Check in</h2>
        <div className="form-field-container">
          <h4 className="form-label">Assigned Participant ID</h4>
          <input type="number" value={this.state.id} onChange={this.setId} />
          <button className="button" onClick={this.handleNext}>
            Next
          </button>
        </div>
      </div>
    );
  };

  renderPage2 = () => {
    return (
      <div>
        <h2>MIA Empathy Tool Check in</h2>
        <div className="form-field-container">
          <div className="secondary">
            <h4 className="form-label">Age</h4>
            <input
              type="number"
              value={this.state.age}
              onChange={this.setAge}
            />
          </div>
          <div className="secondary">
            <h4 className="form-label">Gender</h4>
            <select
              name="type"
              value={this.state.gender}
              onChange={this.setGender}
            >
              <option value="" style={{ display: "none" }} />
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-field-container">
          <h4 className="form-label">Race</h4>
          <select name="type" value={this.state.race} onChange={this.setRace}>
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
        </div>
        <button className="button" onClick={this.handleSubmit}>
          Check in
        </button>
      </div>
    );
  };

  renderPage3 = () => {
    return (
      <div>
        <h2>You're checked in!</h2>
        <button className="button" onClick={this.restartForm}>
          Check in new participant
        </button>
      </div>
    );
  };

  render() {
    var page;
    if (this.state.page === 1) {
      page = this.renderPage1();
    } else if (this.state.page === 2) {
      page = this.renderPage2();
    } else {
      page = this.renderPage3();
    }
    return <div id="checkin">{page}</div>;
  }
}

export default Checkin;
