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

  componentDidMount = () => {
    if (this.props.match.params.id) {
      let currentComponent = this;
      this.quizRef = firebase
        .firestore()
        .collection("quizzes")
        .doc(this.props.match.params.id);

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
          console.log(error);
        });
    }
  };

  setName = event => {
    this.setState({ name: event.target.value });
  };

  setAudienceType = event => {
    this.setState({ audienceType: event.target.value });
  };

  setQuestionAnswerType = event => {
    this.setState({ questionAnswerType: event.target.value });
  };

  setQuestion = event => {
    this.setState({ question: event.target.value });
  };

  setQuestionAnswer1 = event => {
    this.setState({ questionAnswer1: event.target.value });
  };

  setQuestionAnswer2 = event => {
    this.setState({ questionAnswer2: event.target.value });
  };

  setQuestionAnswer3 = event => {
    this.setState({ questionAnswer3: event.target.value });
  };

  setQuestionAnswer4 = event => {
    this.setState({ questionAnswer4: event.target.value });
  };

  showQuestionModal = () => {
    this.setState({ showQuestionModal: true });
  };

  hideQuestionsModal = () => {
    this.setState({ showQuestionModal: false });
  };

  showDeleteModal = () => {
    this.setState({ showDeleteModal: true });
  };

  hideDeleteModal = () => {
    this.setState({ showDeleteModal: false });
  };

  processId(id) {
    id = "00" + id.toString();
    let length = id.length;
    id = id.substring(length - 3, length);
    return id;
  }

  addQuestion = () => {
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

    this.setState(prevState => ({
      questions: [...prevState.questions, newQuestion],
      questionId: prevState.questionId + 1,
      questionAnswerType: "",
      question: "",
      questionAnswer1: "",
      questionAnswer2: "",
      questionAnswer3: "",
      questionAnswer4: ""
    }));

    this.hideQuestionsModal();
  };

  deleteQuestion = id => {
    var newArray = [...this.state.questions];
    newArray = newArray.filter(q => q.id !== id);
    var newId = 1;
    newArray.forEach(question => {
      question.id = newId;
      newId += 1;
    });
    this.setState({ questions: newArray, questionId: newId });
  };

  addQuiz = () => {
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
      .then(function() {
        currentComponent.props.match.params.id
          ? alert("Quiz updated!")
          : alert("Quiz added!");
        currentComponent.setState({ goBack: true });
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
  };

  deleteQuiz = () => {
    let currentComponent = this;
    this.hideDeleteModal();
    this.quizRef
      .delete()
      .then(() => {
        alert("Quiz deleted!");
        currentComponent.setState({ goBack: true });
      })
      .catch(error => {
        alert("Error deleting quiz: ", error);
      });
  };

  render() {
    const questions = this.state.questions.map((q, key) => (
      <Question
        key={key}
        id={q.id}
        type={q.type}
        question={q.question}
        correctAnswer={q.correctAnswer}
        delete={this.deleteQuestion}
      />
    ));

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
              <option value="mixed">Mixed</option>
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
          <h2>Add Question</h2>

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
