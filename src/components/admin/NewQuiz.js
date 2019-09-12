import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import firebase from "../../Firebase";
import Modal from "../other/Modal";
import Question from "./Question";

class NewQuiz extends Component {
  state = {
    name: "",
    audienceType: "",
    questions: [],
    showQuestionModal: false,
    showDeleteModal: false,
    questionKey: null,
    questionId: 1,
    questionAnswerType: "",
    question: "",
    questionAnswer1: "",
    questionAnswer2: "",
    questionAnswer3: "",
    questionAnswer4: "",
    goBack: false
  };

  quizRef = firebase
    .firestore()
    .collection("quizzes")
    .doc();
  quizzesRef = firebase.firestore().collection("quizzes");

  /**
   * Fetches data from existing quiz if editing,
   * otherwise generates the next consecutive ID for a new quiz.
   */
  componentDidMount = () => {
    // Editing an existing quiz
    if (this.props.match.params.id) {
      let currentComponent = this;
      // Create a Firebase reference using the quiz's unique ID
      this.quizRef = firebase
        .firestore()
        .collection("quizzes")
        .doc(this.props.match.params.id);

      // Fill in existing quiz data for form inputs
      this.quizRef
        .get()
        .then(doc => {
          currentComponent.setState({
            name: doc.data().name,
            audienceType: doc.data().audienceType,
            questions: doc.data().questions,
            questionId: doc.data().questions.length + 1
          });
        })
        .catch(error => {
          console.log(error + ": Couldn't fetch quiz data");
        });
    }

    // Creating a new quiz
    else {
      // Count the number of existing quizzes
      var count = 1;
      this.quizzesRef.get().then(snapshot => {
        // Get the next available consecutive ID using the number of quizzes
        snapshot.forEach(() => {
          count += 1;
        });
        // Create a Firebase document using this new unique quiz ID
        this.quizRef = firebase
          .firestore()
          .collection("quizzes")
          .doc(this.processId(count));
      });
    }
  };

  /**
   * Event handler that updates state with the quiz's name.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setName = event => {
    this.setState({ name: event.target.value });
  };

  /**
   * Event handler that updates state with the quiz's audience type.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setAudienceType = event => {
    this.setState({ audienceType: event.target.value });
  };

  /**
   * Event handler that updates state with the quiz's answer type.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setQuestionAnswerType = event => {
    this.setState({ questionAnswerType: event.target.value });
  };

  /**
   * Event handler that updates state with a new question.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setQuestion = event => {
    this.setState({ question: event.target.value });
  };

  /**
   * Event handler that updates state with a new question's correct answer.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setQuestionAnswer1 = event => {
    this.setState({ questionAnswer1: event.target.value });
  };

  /**
   * Event handler that updates state with a new question's second answer.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setQuestionAnswer2 = event => {
    this.setState({ questionAnswer2: event.target.value });
  };

  /**
   * Event handler that updates state with a new question's third answer.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setQuestionAnswer3 = event => {
    this.setState({ questionAnswer3: event.target.value });
  };

  /**
   * Event handler that updates state with a new question's fourth answer.
   * @param {Object} event - The DOM event object used to get the value of the trigger element.
   */
  setQuestionAnswer4 = event => {
    this.setState({ questionAnswer4: event.target.value });
  };

  /**
   * Shows the modal to add a new question.
   */
  showQuestionModal = () => {
    this.setState({ showQuestionModal: true });
  };

  /**
   * Hides the modal to add a new question.
   */
  hideQuestionsModal = () => {
    this.setState({
      showQuestionModal: false,
      questionKey: null,
      questionId: this.state.questions.length + 1
    });
  };

  /**
   * Shows the modal to confirm deleting the quiz.
   */
  showDeleteModal = () => {
    this.setState({ showDeleteModal: true });
  };

  /**
   * Hides the modal to confirm deleting the quiz.
   */
  hideDeleteModal = () => {
    this.setState({ showDeleteModal: false });
  };

  /**
   * Creates a 3 digit ID string by prepending 0s to a unique number.
   * @param {number} id - A number from 1 to 99.
   * @returns {string} The 3 digit stringified number with prepended 0s.
   */
  processId(id) {
    // Prepending 0s
    id = "00" + id.toString();

    // Cutting off extraneous 0s
    let length = id.length;
    id = id.substring(length - 3, length);
    return id;
  }

  /**
   * Adds a new question to the quiz.
   */
  addQuestion = () => {
    // Checks that all necessary form fields are filled in
    if (
      !this.state.questionAnswerType ||
      !this.state.question ||
      !this.state.questionAnswer1 ||
      !this.state.questionAnswer2 ||
      !this.state.questionAnswer3 ||
      !this.state.questionAnswer4
    ) {
      alert("All form fields must be filled out!");
      return;
    }

    // Creating the question object
    let newQuestion = {
      id: this.state.questionId,
      type: this.state.questionAnswerType,
      question: this.state.question,
      answers: [
        this.state.questionAnswer1,
        this.state.questionAnswer2,
        this.state.questionAnswer3,
        this.state.questionAnswer4
      ],
      correctAnswer: this.state.questionAnswer1
    };

    let modifyQuestions = new Promise((resolve, reject) => {
      // Editing a specific question
      if (this.state.questionKey != null) {
        this.setState(state => {
          const questions = state.questions.map((item, j) => {
            // Find the question that was edited and replace it with the new information
            if (j === this.state.questionKey) {
              return newQuestion;
            } else {
              return item;
            }
          });
          return {
            questions
          };
        });
      }

      // Creating a new question
      else {
        this.setState(prevState => ({
          questions: [...prevState.questions, newQuestion]
        }));
      }
      resolve();
    });

    // Resetting question input values
    modifyQuestions.then(() => {
      this.setState({
        questionKey: null,
        questionId: this.state.questions.length + 1, // Incrementing for next question to take consecutive ID
        questionAnswerType: "",
        question: "",
        questionAnswer1: "",
        questionAnswer2: "",
        questionAnswer3: "",
        questionAnswer4: ""
      });
      this.hideQuestionsModal();
    });
  };

  /**
   * Edits a question.
   * @param {number} key - The index of the question to edit.
   */
  editQuestion = key => {
    let question = this.state.questions[key];
    this.setState({
      questionKey: key,
      questionId: parseInt(question.id),
      questionAnswerType: question.type,
      question: question.question,
      questionAnswer1: question.answers[0],
      questionAnswer2: question.answers[1],
      questionAnswer3: question.answers[2],
      questionAnswer4: question.answers[3]
    });
    this.showQuestionModal();
  };

  /**
   * Deletes a question.
   * @param {number} id - The ID of the question to delete.
   */
  deleteQuestion = id => {
    var newArray = [...this.state.questions];

    // Remove the question from the array
    newArray = newArray.filter(q => q.id !== id);

    // Change all remaining questions' IDs to be consecutive
    var newId = 1;
    newArray.forEach(question => {
      question.id = newId;
      newId += 1;
    });

    this.setState({
      questions: newArray,
      questionKey: null,
      questionId: newId
    });
  };

  /**
   * Submit the form to add or update a quiz.
   */
  addQuiz = () => {
    // Checks that all necessary form fields were filled in
    if (!this.state.name || !this.state.audienceType || !this.state.questions) {
      alert("All form fields must be filled out!");
      return;
    }

    const currentComponent = this;
    this.quizRef
      .set({
        name: currentComponent.state.name,
        audienceType: currentComponent.state.audienceType,
        questions: currentComponent.state.questions
      })
      .then(() => {
        // Show the appropriate alert
        currentComponent.props.match.params.id
          ? alert("Quiz updated!")
          : alert("Quiz added!");
        // Used to redirect to the quizzes tab
        currentComponent.setState({ goBack: true });
      })
      .catch(error => {
        console.error("Error writing document: ", error);
      });
  };

  /**
   * Deletes the quiz.
   */
  deleteQuiz = () => {
    let currentComponent = this;
    this.hideDeleteModal();
    this.quizRef
      .delete()
      .then(() => {
        alert("Quiz deleted!");
        // Redirects back to the quizzes tab
        currentComponent.setState({ goBack: true });
      })
      .catch(error => {
        alert("Error deleting quiz: ", error);
      });
  };

  /**
   * Renders the new quiz screen.
   * @returns {JSX} The new/update quiz screen.
   */
  render() {
    // All existing questions in the quiz
    const questions = this.state.questions.map((q, key) => (
      <div className="new-question" key={key}>
        <button
          className="close-button"
          onClick={() => this.deleteQuestion(q.id)}
        >
          &#10005;
        </button>
        <div className="content" onClick={() => this.editQuestion(key)}>
          <Question
            id={q.id}
            type={q.type}
            question={q.question}
            correctAnswer={q.correctAnswer}
          />
        </div>
      </div>
    ));

    // Used to redirect back to the quizzes tab
    if (this.state.goBack === true) {
      return (
        <Redirect
          to={this.props.match.params.id ? "../../quizzes" : "../quizzes"}
        />
      );
    }

    return (
      <div className="new-form">
        <div className="header-div">
          <h1>{this.props.match.params.id ? "Edit" : "New"} Quiz</h1>
          {this.props.match.params.id ? (
            <i
              className="fa fa-trash-o delete-button"
              onClick={this.showDeleteModal}
            />
          ) : null}
        </div>
        <div className="form-field-container">
          <div className="form-left">
            <h4 className="form-label">Quiz Name</h4>
            <input
              type="text"
              value={this.state.name}
              onChange={this.setName}
            />
            <h4 className="form-label">Audience Type</h4>
            <select
              name="type"
              value={this.state.audienceType}
              onChange={this.setAudienceType}
            >
              <option value="" style={{ display: "none" }} />
              <option value="adult">Adult</option>
              <option value="child">Child</option>
            </select>
            <button className="button" onClick={this.addQuiz}>
              {this.props.match.params.id ? "Update" : "Add"} Quiz
            </button>
          </div>
          <div className="form-right">
            <div className="header-div">
              <h4 className="form-label">Questions ({questions.length})</h4>
              <button className="add-button" onClick={this.showQuestionModal}>
                &#10010;
              </button>
            </div>
            {questions}
          </div>
        </div>
        <Modal
          show={this.state.showQuestionModal}
          handleClose={this.hideQuestionsModal}
          handleSubmit={this.addQuestion}
          submitText={"Submit"}
        >
          <h2>{this.state.questionKey != null ? "Edit" : "Add"} Question</h2>

          <h4 className="form-label">Question-Answer Type</h4>
          <select
            name="type"
            value={this.state.questionAnswerType}
            onChange={this.setQuestionAnswerType}
          >
            <option value="" style={{ display: "none" }} />
            <option value="voice-face">Voice to face</option>
            <option value="face-voice">Face to voice</option>
            <option value="illustration-face">Illustration to face</option>
            <option value="illustration-voice">Illustration to voice</option>
            <option value="story-face">Story to face</option>
            <option value="story-voice">Story to voice</option>
          </select>

          <h4 className="form-label">Question</h4>
          <input
            type="text"
            value={this.state.question}
            onChange={this.setQuestion}
          />

          <div className="form-field-container">
            <div className="form-left secondary">
              <h4 className="form-label">Answer 1 (Correct)</h4>
              <input
                type="text"
                value={this.state.questionAnswer1}
                onChange={this.setQuestionAnswer1}
              />
            </div>
            <div className="form-left secondary">
              <h4 className="form-label">Answer 2</h4>
              <input
                type="text"
                value={this.state.questionAnswer2}
                onChange={this.setQuestionAnswer2}
              />
            </div>
          </div>

          <div className="form-field-container">
            <div className="form-left secondary">
              <h4 className="form-label">Answer 3</h4>
              <input
                type="text"
                value={this.state.questionAnswer3}
                onChange={this.setQuestionAnswer3}
              />
            </div>
            <div className="form-left secondary">
              <h4 className="form-label">Answer 4</h4>
              <input
                type="text"
                value={this.state.questionAnswer4}
                onChange={this.setQuestionAnswer4}
              />
            </div>
          </div>
        </Modal>
        <Modal
          show={this.state.showDeleteModal}
          handleClose={this.hideDeleteModal}
          handleSubmit={this.deleteQuiz}
          submitText={"Delete Quiz"}
        >
          <h3>Are you sure you want to delete this quiz?</h3>
          <h5>This action cannot be undone.</h5>
        </Modal>
      </div>
    );
  }
}
export default NewQuiz;
