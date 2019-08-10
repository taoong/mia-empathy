import React, { Component } from "react";
import Identification from "./Identification";
import Quiz from "./Quiz";
import Result from "./Result";
import firebase from "../../Firebase";

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
      endScreen: true,
      kiosk: false,
      color: this.randomColor(),
      connected: true
    };
  }

  /**
   * Asynchrononously fetches the most recent session and updates the view accordingly.
   */
  async componentWillMount() {
    // Fetches most recent session
    let currentSession = await this.getCurrentSession();

    // If a session can be retrieved, update the state to display the quiz
    if (currentSession != null) {
      this.setState({
        session: currentSession,
        sessionId: currentSession.id,
        quizId: currentSession.data().quiz
      });
      let quizQuestions = await this.getQuizQuestions();
      this.setState({ quizQuestions: quizQuestions });
      this.restartQuiz();
    }

    // Otherwise, show that no connection was established
    else {
      this.setState({ connected: false });
    }
  }

  /**
   * Fetches the session with the most recent start datetime before now.
   * @returns {firebase.firestore.DocumentSnapshot} Contains data from the most recent session's document.
   */
  async getCurrentSession() {
    let sessionRef = await this.sessionsRef
      .where("datetime", "<", new Date())
      .orderBy("datetime", "desc")
      .limit(1)
      .get();
    return sessionRef.docs[0];
  }

  /**
   * Fetches the current session's quiz questions.
   * @returns {Array} Quiz questions, where each question is an object in the array.
   */
  async getQuizQuestions() {
    let quizRef = await this.quizzesRef.doc(this.state.quizId).get();
    return quizRef.data().questions;
  }

  /**
   * Moves user back to identification screen and resets state.
   */
  restartQuiz = () => {
    // Shuffling answer options
    const shuffledAnswerOptions = this.state.quizQuestions.map(question =>
      this.shuffleArray(question.answers)
    );

    // Resetting state
    this.setState({
      question: this.state.quizQuestions[0].question,
      questionType: this.state.quizQuestions[0].type,
      questionId: -1, // Identification screen
      answerOptions: shuffledAnswerOptions[0],
      selectedAnswer: "",
      answers: [],
      score: 0,
      finished: false
    });
  };

  /**
   * Shuffles an array's elements; used for shuffling answer options in the quiz.
   * @param {Array} a - The original, unshuffled array.
   * @returns {Array} The shuffled array.
   */
  shuffleArray(a) {
    var currentIndex = a.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = a[currentIndex];
      a[currentIndex] = a[randomIndex];
      a[randomIndex] = temporaryValue;
    }

    return a;
  }

  /**
   * Event handler for answer selection.
   * @param {Event} event - Contains selected answer.
   */
  handleAnswerSelected = event => {
    this.setParticipantAnswer(event.currentTarget.value);
  };

  /**
   * Event handler that updates state using the selected answer.
   * @param {String} answer - The selected answer.
   */
  setParticipantAnswer(answer) {
    // If the correct answer was selected, add 1 to the score
    if (
      answer === this.state.quizQuestions[this.state.questionId].correctAnswer
    ) {
      this.setState(state => ({
        score: state.score + 1
      }));
    }

    // Update the answers array for viewing after the quiz
    var newAnswerArray = this.state.answers;
    newAnswerArray.push(answer);
    this.setState({
      selectedAnswer: answer,
      answers: newAnswerArray
    });
  }

  /**
   * Moves on to the next question in the quiz.
   */
  setNextQuestion = () => {
    // If it is not the last question, go to the next question
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
    }
    // If it is the last question, end the quiz
    else {
      let responseRef = this.responses.doc(
        this.state.sessionId + this.state.participant.id
      );
      if (this.state.quizType === "pre") {
        responseRef.set({
          pid: this.state.participant.id,
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

  /**
   * Setter method for the current participant.
   * @param {Object} p - The current participant.
   */
  setParticipant = p => {
    this.setState({
      participant: p,
      questionId: 0
    });
  };

  /**
   * Setter method for the current quiz type.
   * @param {Object} quizType - The current quiz type.
   */
  setQuizType = quizType => {
    this.setState({ quizType: quizType });
  };

  /**
   * Writes inputted participant information to Firebase.
   * @param {object} new_p - The object containing new updated participant information.
   */
  submitParticipantInfo = new_p => {
    var participants = this.state.session.data().participants;
    participants.forEach(p => {
      if (p.id === this.state.participant.id) {
        let index = participants.indexOf(p);
        participants.splice(index, 1, new_p); // Replaces old participant with new_p
      }
    });

    this.sessionsRef
      .doc(this.state.sessionId)
      .set({ participants: participants }, { merge: true });

    alert("You've completed the quiz!");

    this.restartQuiz();
  };

  /**
   * Generates a random color.
   * @returns {Array} An array containing a primary and secondary color in hex format.
   */
  randomColor = () => {
    let colors = [
      ["#2848D0", "#A7D8ED"],
      ["#489630", "#B7DC56"],
      ["#EF7F3A", "#F8CD76"],
      ["#FBE14C", "#FCEE98"]
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  /**
   * Renders the identification screen where the user must input their participant ID.
   * @returns {JSX} The Identification component.
   */
  renderIdentification() {
    return (
      <Identification
        session={this.state.session}
        setParticipant={this.setParticipant}
        setQuizType={this.setQuizType}
      />
    );
  }

  /**
   * Renders a question in the current session's quiz.
   * @returns {JSX} The Quiz component.
   */
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

  /**
   * Renders the result screen.
   * @returns {JSX} The Result component.
   */
  renderResult() {
    return (
      <Result
        quizResult={this.state.score}
        restartQuiz={this.restartQuiz}
        total={this.state.quizQuestions.length}
        answers={this.state.answers}
        kiosk={this.state.kiosk}
        participant={this.state.participant}
        quizType={this.state.quizType}
        submitParticipantInfo={this.submitParticipantInfo}
      />
    );
  }

  /**
   * Renders a screen telling the user that there is no internet connection.
   * @returns {JSX} A simple card showing no internet connection.
   */
  renderNoConnection() {
    return (
      <div className="card-form">
        There was a problem connecting to the app! Please try again later.
      </div>
    );
  }

  /**
   * The main logic determining which screen to show depending on state.
   * @returns {JSX} The appropriate screen depending on state.
   */
  renderApp() {
    // No internet connection screen
    if (!this.state.connected) {
      return this.renderNoConnection();
    }

    // Identification screen
    else if (this.state.questionId === -1) {
      return this.renderIdentification();
    }

    // Finish screen
    else if (this.state.finished) {
      return this.renderResult();
    }

    // Quiz
    else {
      return this.renderQuiz();
    }
  }

  /**
   * Render method.
   * @returns {JSX} The user-facing side of the app.
   */
  render() {
    return <div className="App">{this.renderApp()}</div>;
  }
}

export default App;
