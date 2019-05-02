import React, { Component } from "react";
import Identification from "./Identification";
import Quiz from "./Quiz";
import Result from "./Result";
import firebase from "../../Firebase";
// import quizQuestions from "../../testQuestions";

class App extends Component {
  constructor(props) {
    super(props);

    this.responses = firebase.firestore().collection("responses");
    this.sessionsRef = firebase.firestore().collection("sessions");
    this.quizzesRef = firebase.firestore().collection("quizzes");
    this.state = {
      session: null,
      sessionId: null,
      quizId: "001",
      quizQuestions: [],
      quizType: "",
      participant: null,
      questionId: -1,
      question: "",
      questionType: "",
      answerOptions: [],
      selectedAnswer: "",
      answers: [],
      score: 0,
      finished: false,
      kiosk: false,
      color: this.randomColor()
    };
  }

  async componentWillMount() {
    let currentSession = await this.getCurrentSession();
    this.setState({
      session: currentSession,
      sessionId: currentSession.id,
      quizId: currentSession.data().quiz
    });
    let quizQuestions = await this.getQuizQuestions();
    this.setState({ quizQuestions: quizQuestions });
    this.restartQuiz();
  }

  async getCurrentSession() {
    let sessionRef = await this.sessionsRef
      .where("datetime", "<", new Date())
      .orderBy("datetime", "desc")
      .limit(1)
      .get();
    return sessionRef.docs[0];
  }

  async getQuizQuestions() {
    let quizRef = await this.quizzesRef.doc(this.state.quizId).get();
    return quizRef.data().questions;
  }

  restartQuiz = () => {
    const shuffledAnswerOptions = this.state.quizQuestions.map(question =>
      this.shuffleArray(question.answers)
    );
    this.setState({
      question: this.state.quizQuestions[0].question,
      questionType: this.state.quizQuestions[0].type,
      questionId: -1,
      answerOptions: shuffledAnswerOptions[0],
      selectedAnswer: "",
      answers: [],
      score: 0,
      finished: false
    });
  };

  shuffleArray(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  handleAnswerSelected = event => {
    this.setParticipantAnswer(event.currentTarget.value);
  };

  setParticipantAnswer(answer) {
    // TO MODIFY:
    if (
      answer === this.state.quizQuestions[this.state.questionId].correctAnswer
    ) {
      this.setState(state => ({
        score: state.score + 1
      }));
    }

    var newAnswerArray = this.state.answers;
    newAnswerArray.push(answer);
    this.setState({
      selectedAnswer: answer,
      answers: newAnswerArray
    });
  }

  setNextQuestion = () => {
    if (this.state.questionId !== this.state.quizQuestions.length - 1) {
      const questionId = this.state.questionId + 1;
      this.setState({
        questionId: questionId,
        question: this.state.quizQuestions[questionId].question,
        questionType: this.state.quizQuestions[questionId].type,
        answerOptions: this.state.quizQuestions[questionId].answers,
        selectedAnswer: "",
        color: this.randomColor()
      });
    } else {
      let responseRef = this.responses.doc(
        this.state.sessionId + this.state.participant.id
      );
      if (this.state.quizType === "pre") {
        responseRef.set({
          firstname: this.state.participant.firstname,
          lastname: this.state.participant.lastname,
          age: this.state.participant.age,
          gender: this.state.participant.gender,
          race: this.state.participant.race,
          session: this.state.sessionId,
          quiz: this.state.quizId,
          datetime: new Date(),
          pre: this.state.answers
        });
      } else {
        responseRef.update({
          post: this.state.answers
        });
      }

      this.setState({
        finished: true
      });
    }
  };

  setParticipant = p => {
    this.setState({
      participant: p,
      questionId: 0
    });
  };

  setQuizType = quizType => {
    this.setState({ quizType: quizType });
  };

  randomColor = () => {
    let colors = [
      ["#DE405D", "#E58FA0"],
      ["#2848D0", "#A7D8ED"],
      ["#489630", "#B7DC56"],
      ["#EF7F3A", "#F8CD76"],
      ["#FBE14C", "#FCEE98"]
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  renderIdentification() {
    return (
      <Identification
        session={this.state.session}
        setParticipant={this.setParticipant}
        setQuizType={this.setQuizType}
      />
    );
  }

  renderQuiz() {
    return (
      <Quiz
        selectedAnswer={this.state.selectedAnswer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionType={this.state.questionType}
        questionTotal={this.state.quizQuestions.length}
        onAnswerSelected={this.handleAnswerSelected}
        nextQuestion={this.setNextQuestion}
        color={this.state.color}
      />
    );
  }

  renderResult() {
    return (
      <Result
        quizResult={this.state.score}
        restartQuiz={this.restartQuiz}
        total={this.state.quizQuestions.length}
        answers={this.state.answers}
        kiosk={this.state.kiosk}
      />
    );
  }

  renderApp() {
    if (this.state.questionId === -1) {
      return this.renderIdentification();
    } else {
      if (this.state.finished) {
        return this.renderResult();
      } else {
        return this.renderQuiz();
      }
    }
  }

  render() {
    return <div className="App">{this.renderApp()}</div>;
  }
}

export default App;
