import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "../Firebase";

class Identification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: ""
    };
    this.users = firebase.firestore().collection("users");
  }

  render() {
    return (
      <div className="identification">
        <h2>User ID:</h2>
        <input type="submit" />
      </div>
    );
  }
}

Identification.propTypes = {
  setUserId: PropTypes.func.isRequired
};

export default Identification;
