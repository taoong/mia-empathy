import React, { Component } from "react";
import { Link } from "react-router-dom";

class Nav extends Component {
  render() {
    return (
      <nav className="nav">
        <Link to="/admin" className="nav-brand">
          <img
            src={require("../images/mia-logo.jpg")}
            className="nav-logo"
            alt="logo"
          />
        </Link>

        <ul>
          <li>
            <Link className="nav-link" to="/admin/sessions">
              Sessions
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="/admin/quizzes">
              Quizzes
            </Link>
          </li>
          <li>
            <button onClick={this.props.signout}>Sign Out</button>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Nav;
