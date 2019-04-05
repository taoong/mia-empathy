import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import firebase from "../../Firebase";
import NewQuiz from "./NewQuiz";
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

  editQuiz = id => {
    this.props.history.push(`${this.props.match.url}/edit/${id}`);
  };

  uppercaseFirst = audience => {
    return audience.charAt(0).toUpperCase() + audience.slice(1);
  };

  processTypeString = type => {
    let question = type.split("-")[0];
    let answer = type.split("-")[1];
    return this.uppercaseFirst(question) + " to " + this.uppercaseFirst(answer);
  };

  renderQuizRows() {
    if (this.state.quizzes.length > 0) {
      const quizzes = this.state.quizzes.map((quiz, index) => (
        <tr key={index} onClick={() => this.editQuiz(quiz.id)}>
          <td>{quiz.id}</td>
          <td>{quiz.data().name}</td>
          <td>{this.uppercaseFirst(quiz.data().audienceType)}</td>
          <td>{this.processTypeString(quiz.data().type)}</td>
        </tr>
      ));
      return quizzes;
    }
  }

  render() {
    const quizzes = this.renderQuizRows();

    return (
      <div id="quizzes">
        <div className="header-div">
          <h1>Quizzes</h1>

          <Link to={`${this.props.match.url}/new`} className="add-button">
            <button>&#10010;</button>
          </Link>
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
        <Route path={`${this.props.match.path}/new`} component={NewQuiz} />
      </div>
    );
  }
}
export default Quizzes;
