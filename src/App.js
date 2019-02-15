import React, { Component } from "react";
import Identification from "./components/Identification";
import quizQuestions from "./testQuestions";
import Quiz from "./components/Quiz";
import Result from "./components/Result";
import firebase from "./Firebase";

class App extends Component {
  constructor(props) {
    super(props);

    this.users = firebase.firestore().collection("users");
    this.state = {
      quizId: "001",
      quizType: "pre",
      userId: "",
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

    this.users
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          console.log(doc.id, " => ", doc.data());
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
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
    this.setUserAnswer(event.currentTarget.value);

    if (this.state.questionId !== quizQuestions.length - 1) {
      setTimeout(() => this.setNextQuestion(), 600);
    } else {
      let userRef = this.users
        .doc(this.state.userId)
        .collection("responses")
        .doc(this.state.quizId);
      if (this.state.quizType === "pre") {
        userRef.set(
          {
            pre: this.state.answers
          },
          { merge: true }
        );
      } else {
        userRef.set(
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

  setUserAnswer(answer) {
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
    console.log(this.state.answers);
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

  setUserId = id => {
    this.setState({ userId: id, questionId: 0 });
  };

  renderIdentification() {
    return <Identification setUserId={this.setUserId} />;
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
