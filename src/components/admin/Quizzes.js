import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import firebase from "../../Firebase";
import NewQuiz from "./NewQuiz";
class Quizzes extends Component {
  state = { quizzes: [] };
  quizzesRef = firebase.firestore().collection("quizzes");

  /**
   * Fetches quizzes from Firebase.
   */
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

  /**
   * Redirects to the NewQuiz component for editing an existing quiz.
   * @param {string} id - The quiz ID.
   */
  editQuiz = id => {
    this.props.history.push(`${this.props.match.url}/edit/${id}`);
  };

  /**
   * Makes the first letter of a word uppercase.
   * @prop {string} word - The word to process.
   * @returns {string} The inputted word with its first letter in uppercase.
   */
  uppercaseFirstLetter = word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  /**
   * Renders the rows/table to display the quizzes' data.
   * @returns {JSX} The table of quizzes.
   */
  renderQuizRows() {
    if (this.state.quizzes.length > 0) {
      const quizzes = this.state.quizzes.map((quiz, index) => (
        <tr key={index} onClick={() => this.editQuiz(quiz.id)}>
          <td>{quiz.id}</td>
          <td>{quiz.data().name}</td>
          <td>{this.uppercaseFirstLetter(quiz.data().audienceType)}</td>
          <td>{quiz.data().questions.length}</td>
        </tr>
      ));
      return quizzes;
    }
  }

  /**
   * Renders the "Quizzes" tab.
   * @returns {JSX} The "Quizzes" tab.
   */
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
              <th>Questions</th>
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
