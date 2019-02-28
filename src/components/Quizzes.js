import React, { Component } from "react";
import firebase from "../Firebase";
class Quizzes extends Component {
  state = { quizzes: [] };
  quizzesRef = firebase.firestore().collection("quizzes");

  componentDidMount = () => {
    let currentComponent = this;
    this.quizzesRef.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        currentComponent.setState(prevState => ({
          quizzes: [...prevState.quizzes, doc]
        }));
      });
    });
  };

  addQuiz() {
    console.log("Add quiz");
  }

  renderQuizRows() {
    if (this.state.quizzes.length > 0) {
      const quizzes = this.state.quizzes.map((quiz, index) => (
        <tr key={index}>
          <td>{quiz.id}</td>
          <td>{quiz.data().name}</td>
          <td>{quiz.data().audience}</td>
          <td>{quiz.data().type}</td>
        </tr>
      ));
      return quizzes;
    }
  }

  render() {
    const quizzes = this.renderQuizRows();

    return (
      <div className="quizzes">
        <div className="header-div">
          <h1>Quizzes</h1>
          <button onClick={this.addQuiz}>&#10010;</button>
        </div>
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Quiz Name</th>
              <th>Audience Type</th>
              <th>Question-Answer Type</th>
            </tr>
            {quizzes}
          </tbody>
        </table>
      </div>
    );
  }
}
export default Quizzes;
