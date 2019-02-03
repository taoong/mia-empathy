import React from "react";
import PropTypes from "prop-types";

import Question from "../components/Question";
import QuestionCount from "../components/QuestionCount";
import AnswerOption from "../components/AnswerOption";

function Quiz(props) {
  return (
    <div className="quiz">
      <QuestionCount
        questionNumber={props.questionId + 1}
        total={props.questionTotal}
      />
      <Question questionContent={props.question} />
      <ul className="answerOptions">
        {props.answerOptions.map(key => (
          <AnswerOption
            key={key}
            answerContent={key}
            selectedAnswer={props.selectedAnswer}
            onAnswerSelected={props.onAnswerSelected}
          />
        ))}
      </ul>
    </div>
  );
}

Quiz.propTypes = {
  selectedAnswer: PropTypes.string.isRequired,
  answerOptions: PropTypes.array.isRequired,
  question: PropTypes.string.isRequired,
  questionId: PropTypes.number.isRequired,
  questionTotal: PropTypes.number.isRequired,
  onAnswerSelected: PropTypes.func.isRequired
};

export default Quiz;
