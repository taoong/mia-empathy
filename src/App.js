import React, { Component } from "react";
import quizQuestions from "./testQuestions";
import Quiz from "./components/Quiz";
import Result from "./components/Result";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questionId: 1,
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
      questionId: 0,
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
    this.setUserAnswer(event.currentTarget.value);

    if (this.state.questionId !== quizQuestions.length - 1) {
      setTimeout(() => this.setNextQuestion(), 600);
    } else {
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

  renderQuiz() {
    return (
      <Quiz
        selectedAnswer={this.state.selectedAnswer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={quizQuestions.length}
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

  render() {
    return (
      <div className="App">
        {this.state.finished ? this.renderResult() : this.renderQuiz()}
      </div>
    );
  }
}

export default App;
