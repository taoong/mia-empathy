import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../Firebase";

class Sessions extends Component {
  state = { sessions: [] };
  sessionRef = firebase.firestore().collection("sessions");

  componentDidMount = () => {
    let currentComponent = this;
    this.sessionRef.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        currentComponent.setState(prevState => ({
          sessions: [...prevState.sessions, doc]
        }));
      });
    });
  };

  getDateTime(timestamp) {
    const date = timestamp.toDate();
    const year = date.getFullYear().toString();
    const month = date.getMonth().toString();
    const day = date.getDate().toString();
    const hours = date.getHours().toString();
    const minutes = date.getMinutes().toString();
    return `${month}/${day}/${year}  -  ${hours}:${minutes}`;
  }

  renderSessionRows() {
    if (this.state.sessions.length > 0) {
      const sessions = this.state.sessions.map((session, index) => (
        <tr key={index}>
          <td>{session.id}</td>
          <td>{session.data().organization}</td>
          <td>{this.getDateTime(session.data().datetime)}</td>
          <td>{session.data().participants.length}</td>
        </tr>
      ));
      return sessions;
    }
  }

  render() {
    const sessions = this.renderSessionRows();

    return (
      <div className="sessions">
        <div className="header-div">
          <h1>Sessions</h1>
          <Link to={`${this.props.match.url}/new`} className="add-button">
            <button onClick={this.addSession}>&#10010;</button>
          </Link>
        </div>
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Organization Name</th>
              <th>Scheduled Date/Time</th>
              <th>No. Participants</th>
            </tr>
            {sessions}
          </tbody>
        </table>
      </div>
    );
  }
}
export default Sessions;
