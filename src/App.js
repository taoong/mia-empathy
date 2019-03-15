import React, { Component } from "react";
import Identification from "./components/Identification";
import quizQuestions from "./testQuestions";
import Quiz from "./components/Quiz";
import Result from "./components/Result";
import firebase from "./Firebase";

class App extends Component {
  constructor(props) {
    super(props);

    this.participants = firebase.firestore().collection("participants");
    this.sessionsRef = firebase.firestore().collection("sessions");
    this.state = {
      session: null,
      quizId: "001",
      quizType: "pre",
      participantId: "",
      questionId: -1,
      question: "",
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
          currentComponent.setState({ session: doc });
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
      let participantRef = this.participants
        .doc(this.state.participantId)
        .collection("responses")
        .doc(this.state.quizId);
      if (this.state.quizType === "pre") {
        participantRef.set(
          {
            pre: this.state.answers
          },
          { merge: true }
        );
      } else {
        participantRef.set(
          {
            post: this.state.answers
          },
          { merge: true }
        );
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
      answerOptions: quizQuestions[questionId].answers,
      selectedAnswer: ""
    });
  }

  setParticipantId = id => {
    this.setState({ participantId: id, questionId: 0 });
  };

  setQuizType = quizType => {
    this.setState({ quizType: quizType });
  };

  renderIdentification() {
    return (
      <Identification
        session={this.state.session}
        setParticipantId={this.setParticipantId}
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
