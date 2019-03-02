import React, { Component } from "react";
import firebase from "../Firebase";

class NewSession extends Component {
  state = {
    organization: "",
    type: "",
    date: "",
    time: "",
    participants: []
  };
  sessionRef = firebase.firestore().collection("sessions");

  componentDidMount = () => {};

  setOrganization = event => {
    this.setState({ organization: event.target.value });
  };

  setType = event => {
    this.setState({ type: event.target.value });
  };

  setDate = event => {
    this.setState({ date: event.target.value });
  };

  setTime = event => {
    this.setState({ time: event.target.value });
  };

  addSession() {
    console.log("Added session!");
  }

  render() {
    return (
      <div className="new-form">
        <div className="header-div">
          <h1>New Session</h1>
        </div>
        <div className="form-field-container">
          <div className="form-left">
            <h4 className="form-label">Organization</h4>
            <input
              type="text"
              value={this.state.organization}
              onChange={this.setOrganization}
            />
            <h4 className="form-label">Type</h4>
            <select name="type" value={this.state.type} onChange={this.setType}>
              <option value="adult">Adult</option>
              <option value="child">Child</option>
              <option value="mixed">Mixed</option>
            </select>
            <div className="form-field-container">
              <div className="form-left secondary">
                <h4 className="form-label">Date</h4>
                <input
                  type="text"
                  value={this.state.date}
                  onChange={this.setDate}
                />
              </div>
              <div className="form-right secondary">
                <h4 className="form-label">Time</h4>
                <input
                  type="text"
                  value={this.state.time}
                  onChange={this.setTime}
                />
              </div>
            </div>
          </div>
          <div className="form-right">
            <h4 className="form-label">Participants</h4>
          </div>
        </div>
        <button className="button" onClick={this.addSession}>
          Add Session
        </button>
      </div>
    );
  }
}
export default NewSession;
