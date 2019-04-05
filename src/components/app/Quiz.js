import React from "react";
import PropTypes from "prop-types";

import Question from "./Question";
import QuestionCount from "./QuestionCount";
import AnswerOption from "./AnswerOption";

function Quiz(props) {
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
        {props.answerOptions.map(key => (
          <AnswerOption
            key={key}
            answerContent={key}
            selectedAnswer={props.selectedAnswer}
            onAnswerSelected={props.onAnswerSelected}
            color={props.color}
          />
        ))}
      </ul>
      {props.imageUrl ? (
        <img src={require("../../" + props.imageUrl)} alt="Not found!" />
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
  onAnswerSelected: PropTypes.func.isRequired,
  color: PropTypes.array.isRequired
};

export default Quiz;
