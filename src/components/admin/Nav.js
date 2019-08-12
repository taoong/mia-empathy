import React, { Component } from "react";
import { Link } from "react-router-dom";

class Nav extends Component {
  /**
   * Renders the nav bar for the admin-side.
   */
  render() {
    return (
      <nav className="nav">
        <Link to="/admin" className="nav-brand">
          <img
            src={require("../../images/mia-logo.jpg")}
            className="nav-logo"
            alt="logo"
          />
        </Link>

        <div className="nav-links">
          <Link className="nav-link" to="/admin">
            Dashboard
          </Link>

          <Link className="nav-link" to="/admin/sessions">
            Sessions
          </Link>

          <Link className="nav-link" to="/admin/quizzes">
            Quizzes
          </Link>
        </div>
        <div className="nav-right">
          <button onClick={this.props.signout}>Sign Out</button>
        </div>
      </nav>
    );
  }
}

export default Nav;
