import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../../Firebase";

class Sessions extends Component {
  state = { sessions: [] };
  sessionRef = firebase.firestore().collection("sessions");

  /**
   * Fetches sessions from Firebase.
   */
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
   * Redirects to the NewSession component for editing an existing session.
   * @param {string} id - The session ID.
   */
  editSession = id => {
    this.props.history.push(`${this.props.match.url}/edit/${id}`);
  };

  /**
   * Renders the rows/table to display the sessions' data.
   * @returns {JSX} The table of sessions.
   */
  renderSessionRows() {
    if (this.state.sessions != null && this.state.sessions.length > 0) {
      const sessions = this.state.sessions.map((session, index) => (
        <tr key={index} onClick={() => this.editSession(session.id)}>
          <td>{session.data().sessionName}</td>
          <td>{this.getDateTime(session.data().datetime)}</td>
          <td>{session.data().participants.length}</td>
        </tr>
      ));
      return sessions;
    }
  }

  /**
   * Renders the "Sessions" tab.
   * @returns {JSX} The "Sessions" tab.
   */
  render() {
    const sessions = this.renderSessionRows();

    return (
      <div id="sessions">
        <div className="header-div">
          <h1>Sessions</h1>
          <Link to={`${this.props.match.url}/new`} className="add-button">
            <button>&#10010;</button>
          </Link>
        </div>
        <table>
          <tbody>
            <tr>
              <th>Session Name</th>
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
