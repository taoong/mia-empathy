import React, { Component } from "react";
import Identification from "./components/Identification";
import quizQuestions from "./testQuestions";
import Quiz from "./components/Quiz";
import Result from "./components/Result";
import firebase from "./Firebase";

class App extends Component {
  constructor(props) {
    super(props);

    this.responses = firebase.firestore().collection("responses");
    this.sessionsRef = firebase.firestore().collection("sessions");
    this.state = {
      session: null,
      sessionId: null,
      quizId: "001",
      quizType: "",
      participant: null,
      questionId: -1,
      question: "",
      questionType: "",
      answerOptions: [],
      selectedAnswer: "",
      answers: [],
      score: 0,
      finished: false
    };
  }

  componentWillMount() {
    this.restartQuiz();
    this.getCurrentSession();
  }

  getCurrentSession() {
    let currentComponent = this;
    this.sessionsRef
      .where("datetime", "<", new Date())
      .orderBy("datetime", "desc")
      .limit(1)
      .get()
      .then(snapshot => {
        snapshot.forEach(function(doc) {
          currentComponent.setState({ session: doc, sessionId: doc.id });
        });
      });
  }

  restartQuiz = () => {
    const shuffledAnswerOptions = quizQuestions.map(question =>
      this.shuffleArray(question.answers)
    );
    this.setState({
      question: quizQuestions[0].question,
      answerOptions: shuffledAnswerOptions[0],
      questionId: -1,
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

    if (this.state.questionId !== quizQuestions.length - 1) {
      setTimeout(() => this.setNextQuestion(), 600);
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

      setTimeout(
        () =>
          this.setState({
            finished: true
          }),
        600
      );
    }
  };

  setParticipantAnswer(answer) {
    if (answer === quizQuestions[this.state.questionId].correctAnswer) {
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

  setNextQuestion() {
    const questionId = this.state.questionId + 1;
    this.setState({
      questionId: questionId,
      question: quizQuestions[questionId].question,
      questionType: quizQuestions[questionId].type,
      answerOptions: quizQuestions[questionId].answers,
      selectedAnswer: ""
    });
  }

  setParticipant = p => {
    this.setState({ participant: p, questionId: 0 });
  };

  setQuizType = quizType => {
    this.setState({ quizType: quizType });
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
        questionTotal={quizQuestions.length}
        imageUrl={quizQuestions[this.state.questionId].imageUrl}
        onAnswerSelected={this.handleAnswerSelected}
      />
    );
  }

  renderResult() {
    return (
      <Result
        quizResult={this.state.score}
        restartQuiz={this.restartQuiz}
        total={quizQuestions.length}
        answers={this.state.answers}
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
