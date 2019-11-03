import React, { Component } from "react";
import firebase from "../../Firebase";

class Checkin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      kiosk: false,
      id: "",
      firstname: "",
      lastname: "",
      email: "",
      age: "",
      gender: "",
      race: "",
      session: null,
      page: 1
    };

    this.sessionsRef = firebase.firestore().collection("sessions");

    this.handleNext = this.handleNext.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generateId = this.generateId.bind(this);
  }

  /**
   * Updates state with the current session.
   */
  async UNSAFE_componentWillMount() {
    let currentSession = await this.getCurrentSession();
    this.setState({
      session: currentSession
    });
  }

  /**
   * Gets an existing session with a starting time closest to and before the current datetime.
   * @returns {firebase.firestore.QueryDocumentSnapshot[]} The most recent existing session.
   */
  async getCurrentSession() {
    let sessionRef = await this.sessionsRef
      .where("datetime", "<", new Date())
      .orderBy("datetime", "desc")
      .limit(1)
      .get();
    if (sessionRef.docs[0] == null) {
      alert(
        "Could not fetch current session information! Make sure you are connected to the internet."
      );
      return;
    }
    return sessionRef.docs[0];
  }

  changeType = () => {
    this.restartForm();
    this.setState({ kiosk: !this.state.kiosk });
  };

  setId = event => {
    this.setState({ id: event.target.value });
  };

  /**
   * Generates a participant ID for kiosk participants who haven't been assigned an ID yet.
   * @returns {string} A unique participant ID.
   */
  async generateId() {
    // Get the current session
    let currentSession = await this.getCurrentSession();

    // Collecting all ids
    let allIds = [];
    for (var p in currentSession.data().participants) {
      allIds.push(parseInt(currentSession.data().participants[p].id));
    }
    for (var c in currentSession.data().checked_in) {
      allIds.push(parseInt(currentSession.data().checked_in[c].id));
    }

    // If nobody has checked in yet, just assign the ID 001
    if (allIds.length === 0) {
      return "001";
    }

    // Get the next biggest number and prepend 0's if necessary
    var id = Math.max(...allIds) + 1;
    id = "00" + id.toString();
    let length = id.length;
    id = id.substring(length - 3, length);

    return id;
  }

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

  setFirstName = event => {
    this.setState({ firstname: event.target.value });
  };

  setLastName = event => {
    this.setState({ lastname: event.target.value });
  };

  setEmail = event => {
    this.setState({ email: event.target.value });
  };

  setAge = event => {
    let age = event.target.value < 113 ? event.target.value : "113";
    this.setState({ age: age });
  };

  setGender = event => {
    this.setState({ gender: event.target.value });
  };

  setRace = event => {
    this.setState({ race: event.target.value });
  };

  /**
   * Resets the checkin form by updating component state.
   */
  restartForm = () => {
    this.setState({
      id: "",
      age: "",
      firstname: "",
      lastname: "",
      gender: "",
      race: "",
      page: 1
    });
  };

  async handleNext() {
    if (!this.state.id) {
      alert("Participant ID input can't be blank!");
      return;
    }
    let currentSession = await this.getCurrentSession();
    let participants = currentSession.data().participants;

    // Looking for participant ID in current session
    var found = false;
    for (var p in participants) {
      if (participants[p].id === this.state.id) {
        found = true;
        this.setState({
          firstname: participants[p].firstname,
          lastname: participants[p].lastname
        });
        break;
      }
    }
    if (found) {
      this.setState({ page: 2 });
    } else {
      alert("Could not find participant ID!");
    }
  }

  goBack = () => {
    this.setState({ page: 1 });
  };

  async handleSubmit() {
    if (!this.state.firstname || !this.state.lastname) {
      alert("First/last name inputs can't be blank!");
      return;
    }

    let currentParticipant = {
      kiosk: this.state.kiosk,
      id: this.state.id,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email: this.state.email,
      age: parseInt(this.state.age),
      gender: this.state.gender,
      race: this.state.race
    };

    let currentSession = await this.getCurrentSession();
    this.sessionsRef.doc(currentSession.id).update({
      checked_in: firebase.firestore.FieldValue.arrayUnion(currentParticipant)
    });

    this.setState({
      page: 3
    });
  }

  renderPage1 = () => {
    return (
      <div>
        <h2>MIA Empathy Tool Check in</h2>
        <button className="link" onClick={this.changeType}>
          Click here if you are not with a group or have not received a
          participant ID
        </button>
        <div className="form-field-container">
          <h4 className="form-label">Assigned Participant ID</h4>
          <input type="text" value={this.state.id} onChange={this.setId} />
          <button className="button" onClick={this.handleNext}>
            Next
          </button>
        </div>
      </div>
    );
  };

  renderPage1Kiosk = () => {
    if (this.state.id === "") {
      this.generateId().then(value => {
        this.setState({ id: value });
      });
    }

    return (
      <div>
        <h2>MIA Empathy Tool Check in</h2>
        <button className="link" onClick={this.changeType}>
          Click here if you are participating with a group
        </button>
        <div className="form-field-container">
          <h4 className="form-label">Participant ID</h4>
          <input type="text" value={this.state.id} disabled={true} />
        </div>
        <div className="form-field-container">
          <div className="secondary">
            <h4 className="form-label">First name</h4>
            <input
              type="text"
              value={this.state.firstname}
              onChange={this.setFirstName}
            />
          </div>
          <div className="secondary">
            <h4 className="form-label">Last name</h4>
            <input
              type="text"
              value={this.state.lastname}
              onChange={this.setLastName}
            />
          </div>
        </div>
        <div className="form-field-container">
          <h4 className="form-label">Email</h4>
          <input
            type="text"
            value={this.state.email}
            onChange={this.setEmail}
          />
        </div>
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

  renderPage2 = () => {
    return (
      <div>
        <h2>MIA Empathy Tool Check in</h2>
        <div className="form-field-container">
          <h4 className="form-label">Assigned Participant ID</h4>
          <input type="text" value={this.state.id} disabled={true} />
        </div>
        <div className="form-field-container">
          <div className="secondary">
            <h4 className="form-label">First name</h4>
            <input type="text" value={this.state.firstname} disabled={true} />
          </div>
          <div className="secondary">
            <h4 className="form-label">Last name</h4>
            <input type="text" value={this.state.lastname} disabled={true} />
          </div>
        </div>
        <div className="form-field-container">
          <h4 className="form-label">Email</h4>
          <input
            type="email"
            value={this.state.email}
            onChange={this.setEmail}
          />
        </div>
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
        <div>
          <button className="button secondary" onClick={this.goBack}>
            Back
          </button>
          <button className="button" onClick={this.handleSubmit}>
            Check in
          </button>
        </div>
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
      if (this.state.kiosk) {
        page = this.renderPage1Kiosk();
      } else {
        page = this.renderPage1();
      }
    } else if (this.state.page === 2) {
      page = this.renderPage2();
    } else {
      page = this.renderPage3();
    }
    return (
      <div id="checkin">
        {/* <h2>
          {this.state.session
            ? this.state.session.data().sessionName
            : "Loading session..."}
        </h2>
        <div>
          {this.state.session ? (
            this.getDateTime(this.state.session.data().datetime)
          ) : (
            <br />
          )}
        </div> */}
        {page}
      </div>
    );
  }
}

export default Checkin;
