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
      {props.imageUrl ? (
        <img src={require("../../" + props.imageUrl)} alt="Not found!" />
      ) : null}
      {props.selectedAnswer ? (
        <button onClick={props.nextQuestion}>Continue</button>
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
