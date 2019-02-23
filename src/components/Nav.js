import React, { Component } from "react";
import { Link } from "react-router-dom";

class Nav extends Component {
  render() {
    return (
      <nav className="nav">
        <Link to="/" className="nav-brand">
          <img
            src={require("../images/mia-logo.jpg")}
            className="nav-logo"
            alt="alsdjflalskdjf"
          />
        </Link>

        <div className="nav-right">
          <ul className="nav-item-wrapper">
            <li className="nav-item">
              <Link className="nav-link" to="./sessions">
                Sessions
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to=".//quizzes">
                Quizzes
              </Link>
            </li>
            <li className="nav-item">
              <button onClick={this.props.signout}>Sign Out</button>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Nav;
