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

  handleChange = event => {
    this.setState({ userId: event.target.value });
  };

  handleSubmit = () => {
    let currentComponent = this;
    if (this.state.userId) {
      let userRef = this.users.doc(this.state.userId);
      userRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            currentComponent.props.setUserId(currentComponent.state.userId);
          } else {
            alert("User ID doesn't exist");
          }
        })
        .catch(function(error) {
          console.log("Error getting User ID:", error);
          alert("Error getting User ID");
        });
    } else {
      alert("User ID input can't be blank!");
    }
  };

  render() {
    return (
      <div className="identification">
        <label class="switch">
          <input type="checkbox" />
          <span class="slider round" />
        </label>
        <h2>User ID:</h2>
        <input
          type="text"
          value={this.state.userId}
          onChange={this.handleChange}
        />
        <input
          className="button"
          type="submit"
          value="submit"
          onClick={this.handleSubmit}
        />
      </div>
    );
  }
}

Identification.propTypes = {
  setUserId: PropTypes.func.isRequired
};

export default Identification;
