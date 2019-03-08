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
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  editSession = id => {
    this.props.history.push(`${this.props.match.url}/edit/${id}`);
  };

  renderSessionRows() {
    if (this.state.sessions != null && this.state.sessions.length > 0) {
      const sessions = this.state.sessions.map((session, index) => (
        <tr key={index} onClick={() => this.editSession(session.id)}>
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
      <div id="sessions">
        <div className="header-div">
          <h1>Sessions</h1>
          <Link to={`${this.props.match.url}/new`} className="add-button">
            <button onClick={this.addSession}>&#10010;</button>
          </Link>
        </div>
        <table>
          <tbody>
            <tr>
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