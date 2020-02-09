import { Component } from "react";
import PropTypes from "prop-types";
import Instruction from "./Instruction";
import QuestionCount from "./QuestionCount";
import AnswerOption from "./AnswerOption";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

class Quiz extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playedSound: false
    };
  }

  /**
   * Lifecycle method to set playedSound to false -- used
   * to set instruction content accordingly in the Instruction component.
   */
  componentDidMount = () => {
    this.setState({ playedSound: false });
  };

  /**
   * Processes the question type passed down through props as a string into an array.
   * @returns {array} An array storing the question type and answer type.
   */
  getTypes = () => {
    let questionType = this.props.questionType.split("-")[0];
    let answerType = this.props.questionType.split("-")[1];
    return [questionType, answerType];
  };

  /**
   * Plays the audio file passed down as props.
   */
  playSound = () => {
    let audio = new Audio(require("../../stimuli/" + this.props.question));
    let playPromise = audio.play();
    if (playPromise !== null) {
      playPromise
        .then(() => {
          this.setState({ playedSound: true });
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  /**
   * Gets an appropriate font size depending on how long a question is.
   * @param {number} questionLength - The number of characters in a question.
   * @returns {string} The appropriate font size.
   */
  getFontSize = questionLength => {
    if (questionLength < 200) {
      return "36px";
    } else if (questionLength < 275) {
      return "32px";
    } else if (questionLength < 350) {
      return "28px";
    } else {
      return "26px";
    }
  };

  /**
   * Renders the component.
   * @returns {JSX} The Quiz component.
   */
  render() {
    return (
      <div className="quiz">
        <Instruction
          questionType={this.props.questionType}
          questionId={this.props.questionId}
          color={this.props.color}
          selectedAnswer={this.props.selectedAnswer !== ""}
          playedSound={this.state.playedSound}
        />
        <ul className="answerOptions">
          {this.props.answerOptions.map(answer => (
            <AnswerOption
              key={answer}
              answerType={this.getTypes(this.props)[1]}
              answerContent={answer}
              selectedAnswer={this.props.selectedAnswer}
              onAnswerSelected={this.props.onAnswerSelected}
              color={this.props.color}
            />
          ))}
        </ul>
        {this.getTypes(this.props)[0] === "face" ||
        this.getTypes(this.props)[0] === "illustration" ? (
          <img
            src={require("../../stimuli/" + this.props.question)}
            alt="Not found!"
            className="question-image"
          />
        ) : null}
        {this.getTypes(this.props)[0] === "voice" ? (
          <button
            onClick={this.playSound}
            className="question-sound"
            css={css`
              &:active {
                background-color: ${this.props.color[1]};
              }
            `}
            style={{ border: "20px solid " + this.props.color[0] }}
          />
        ) : null}
        {this.getTypes(this.props)[0] === "story" ? (
          <h3
            className="question-story"
            style={{ fontSize: this.getFontSize(this.props.question.length) }}
          >
            {this.props.question}
          </h3>
        ) : null}

        {this.props.selectedAnswer &&
        !(
          !this.state.playedSound && this.getTypes(this.props)[0] === "voice"
        ) ? (
          <button
            className="next-question"
            style={{ border: "3px solid " + this.props.color[0] }}
            css={css`
              &:active {
                background-color: ${this.props.color[1]};
              }
            `}
            onClick={this.props.nextQuestion}
          >
            Continue
          </button>
        ) : null}
        <QuestionCount
          questionNumber={this.props.questionId + 1}
          total={this.props.questionTotal}
        />
      </div>
    );
  }
}

/**
 * Props passed down from the App component.
 */
Quiz.propTypes = {
  selectedAnswer: PropTypes.string.isRequired,
  answerOptions: PropTypes.array.isRequired,
  question: PropTypes.string.isRequired,
  questionId: PropTypes.number.isRequired,
  questionTotal: PropTypes.number.isRequired,
  questionType: PropTypes.string.isRequired,
  onAnswerSelected: PropTypes.func.isRequired,
  nextQuestion: PropTypes.func.isRequired,
  color: PropTypes.array.isRequired
};

export default Quiz;
