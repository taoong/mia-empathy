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
    this.users
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          if (doc.id === currentComponent.state.userId) {
            currentComponent.props.setUserId(currentComponent.state.userId);
          }
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });

    alert("This user ID has not been registered!");
  };

  render() {
    return (
      <div className="identification">
        <h2>User ID:</h2>
        <input
          type="text"
          value={this.state.userId}
          onChange={this.handleChange}
        />
        <input type="submit" value="submit" onClick={this.handleSubmit} />
      </div>
    );
  }
}

Identification.propTypes = {
  setUserId: PropTypes.func.isRequired
};

export default Identification;
