import React, { Component } from "react";
class Sessions extends Component {
  render() {
    return (
      <div className="sessions">
        <h1>Sessions</h1>
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Organization Name</th>
              <th>Scheduled Date/Time</th>
              <th>No. Participants</th>
            </tr>
            <tr>
              <td>123</td>
              <td>Berkeley High</td>
              <td>1 January 2019, 3:30PM</td>
              <td>50</td>
            </tr>
            <tr>
              <td>123</td>
              <td>Berkeley High</td>
              <td>1 January 2019, 3:30PM</td>
              <td>50</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
export default Sessions;
