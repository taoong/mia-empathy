import React, { Component } from "react";
class AdminHome extends Component {
  /**
   * Renders all content for the home tab.
   */
  render() {
    return (
      <div id="admin-home">
        <section id="recent-sessions">
          <h2>Recent Sessions</h2>
          <div className="row">
            <div className="card">
              <h4 className="card-title">MIA User Test</h4>
              <h6 className="card-date">May 11, 2019, 3:30PM</h6>
            </div>
            <div className="card">
              <h4 className="card-title">MIA User Test</h4>
              <h6 className="card-date">May 11, 2019, 3:30PM</h6>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default AdminHome;
