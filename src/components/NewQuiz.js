import React, { Component } from "react";
import firebase from "../Firebase";

class NewQuiz extends Component {
  sessionRef = firebase.firestore().collection("sessions");

  componentDidMount = () => {};

  addSession() {}

  render() {
    return (
      <div className="new-form">
        <h1>New Quiz</h1>
      </div>
    );
  }
}
export default NewQuiz;
