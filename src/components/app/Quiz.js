import React from "react";
import PropTypes from "prop-types";

import Question from "./Question";
import QuestionCount from "./QuestionCount";
import AnswerOption from "./AnswerOption";

function Quiz(props) {
  function getTypes(props) {
    let questionType = props.questionType.split("-")[0];
    let answerType = props.questionType.split("-")[1];
    return [questionType, answerType];
  }

  function playSound() {
    console.log(props.question);
    let audio = new Audio(require("../../" + props.question));
    let playPromise = audio.play();
    if (playPromise !== null) {
      playPromise
        .then(() => {
          console.log("played");
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  return (
    <div className="quiz">
      <QuestionCount
        questionNumber={props.questionId + 1}
        total={props.questionTotal}
      />
      <Question
        questionContent={props.question}
        questionType={props.questionType}
        questionId={props.questionId}
        color={props.color}
      />
      <ul className="answerOptions">
        {props.answerOptions.map(answer => (
          <AnswerOption
            key={answer}
            answerType={getTypes(props)[1]}
            answerContent={answer}
            selectedAnswer={props.selectedAnswer}
            onAnswerSelected={props.onAnswerSelected}
            color={props.color}
          />
        ))}
      </ul>
      {getTypes(props)[0] === "face" ||
      getTypes(props)[0] === "illustration" ? (
        <img
          src={require("../../" + props.question)}
          alt="Not found!"
          className="question-image"
        />
      ) : null}
      {getTypes(props)[0] === "voice" ? (
        <button
          onClick={playSound}
          className="question-sound"
          style={{ border: "24px solid " + props.color[0] }}
        />
      ) : null}
      {props.selectedAnswer ? (
        <button
          className="next-question"
          style={{ border: "3px solid " + props.color[0] }}
          onClick={props.nextQuestion}
        >
          Continue
        </button>
      ) : null}
    </div>
  );
}

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
