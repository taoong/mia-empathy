import React, { Component } from "react";
import PropTypes from "prop-types";

class Result extends Component {
  constructor(props) {
    super(props);

    this.state = {
      participantFirstName: "",
      participantLastName: "",
      participantGender: "",
      participantOtherGender: "",
      participantRace: "",
      participantOtherRace: "",
      participantAge: "",
      participantZipcode: "",
      participantEmail: "",
      disabledFirstName: "",
      disabledLastName: "",
      disabledGender: "",
      disabledOtherGender: "",
      disabledRace: "",
      disabledOtherRace: "",
      disabledAge: "",
      disabledZipcode: "",
      disabledEmail: "",
      filledInfo: false,
      score: null
    };
  }

  componentDidMount = () => {
    const answers = this.props.answers.map((answer, key) => (
      <li key={key}>{answer}</li>
    ));
    var score = this.props.kiosk ? (
      <div>
        <h2>
          You scored{" "}
          <strong>
            {this.props.quizResult}/{this.props.total}
          </strong>
          !
        </h2>
        <h5>You answered:</h5>
        <ul>{answers}</ul>
      </div>
    ) : null;
    this.setState({ score });

    this.fetchParticipantData();
  };

  // Fetches participant data.
  // If data already exists, make those inputs disabled.
  fetchParticipantData = () => {
    if (this.props.participant) {
      if (this.props.participant.firstname) {
        this.setState({
          disabledFirstName: true,
          participantFirstName: this.props.participant.firstname
        });
      }

      if (this.props.participant.lastname) {
        this.setState({
          disabledLastName: true,
          participantLastName: this.props.participant.lastname
        });
      }

      if (this.props.participant.gender) {
        this.setState({
          disabledGender: true,
          participantGender: this.props.participant.gender
        });
      }

      if (this.props.participant.race) {
        this.setState({
          disabledRace: true,
          participantRace: this.props.participant.race
        });
      }

      if (this.props.participant.age) {
        this.setState({
          disabledAge: true,
          participantAge: this.props.participant.age
        });
      }

      if (this.props.participant.zipcode) {
        this.setState({
          disabledZipcode: true,
          participantZipcode: this.props.participant.zipcode
        });
      }

      if (this.props.participant.email) {
        this.setState({
          disabledEmail: true,
          participantEmail: this.props.participant.email
        });
      }
    }
  };

  setParticipantFirstName = event => {
    this.setState({ participantFirstName: event.target.value });
  };

  setParticipantLastName = event => {
    this.setState({ participantLastName: event.target.value });
  };

  setParticipantGender = event => {
    this.setState({ participantGender: event.target.value });
  };

  setParticipantOtherGender = event => {
    this.setState({ participantOtherGender: event.target.value });
  };

  setParticipantRace = event => {
    this.setState({ participantRace: event.target.value });
  };

  setParticipantOtherRace = event => {
    this.setState({ participantOtherRace: event.target.value });
  };

  setParticipantAge = event => {
    let age = event.target.value < 113 ? event.target.value : "113";
    this.setState({ participantAge: age });
  };

  setParticipantZipcode = event => {
    this.setState({ participantZipcode: event.target.value });
  };

  setParticipantEmail = event => {
    this.setState({ participantEmail: event.target.value });
  };

  renderResult() {
    // Pre-quiz: show end screen
    if (this.props.quizType === "pre" || this.state.filledInfo) {
      return (
        <div>
          <h2>You've finished the quiz!</h2>
          <button className="button" onClick={this.props.restartQuiz}>
            Submit
          </button>
        </div>
      );
    }
    // Post-quiz: participant can input info
    else if (this.props.quizType === "post") {
      return (
        <div>
          <h2>Please fill out your participant information</h2>
          <div className="form-field-container">
            <div className="form-left secondary">
              <h5 className="form-label">First Name</h5>
              <input
                type="text"
                value={this.state.participantFirstName}
                onChange={this.setParticipantFirstName}
                disabled={this.state.disabledFirstName}
              />
            </div>
            <div className="form-left secondary">
              <h5 className="form-label">Last Name</h5>
              <input
                type="text"
                value={this.state.participantLastName}
                onChange={this.setParticipantLastName}
                disabled={this.state.disabledLastName}
              />
            </div>
          </div>

          <div className="form-field-container">
            <div className="form-left secondary">
              <h5 className="form-label">Gender</h5>
              <select
                name="type"
                value={this.state.participantGender}
                onChange={this.setParticipantGender}
                disabled={this.state.disabledGender}
              >
                <option value="" style={{ display: "none" }} />
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="nonbinary">Nonbinary</option>
                <option value="other">
                  Different identity (please specify)
                </option>
              </select>
            </div>
            {this.state.participantGender === "other" ? (
              <div className="form-left secondary other">
                <h5 className="form-label">Other gender</h5>
                <input
                  type="text"
                  value={this.state.participantOtherGender}
                  onChange={this.setParticipantOtherGender}
                  disabled={this.state.disabledOtherGender}
                />
              </div>
            ) : (
              <div />
            )}
          </div>

          <div className="form-field-container">
            <div className="form-left secondary">
              <h5 className="form-label">Race/Ethnicity</h5>
              <select
                name="type"
                value={this.state.participantRace}
                onChange={this.setParticipantRace}
                disabled={this.state.disabledRace}
              >
                <option value="" style={{ display: "none" }} />
                <option value="white">White/Caucasian</option>
                <option value="black">Black/African-American</option>
                <option value="hispanic">Hispanic</option>
                <option value="latinx">Latino/a</option>
                <option value="east asian">
                  East Asian (e.g., Chinese, Japanese, Vietnamese)
                </option>
                <option value="south asian">
                  South Asian (e.g., Indian, Pakistani, Burmese)
                </option>
                <option value="american indian">
                  American Indian or Alaskan Native
                </option>
                <option value="pacific islander">
                  Pacific Islander or Native Hawaiian
                </option>
                <option value="other">
                  Not listed here or prefer to self-describe
                </option>
              </select>
            </div>
            {this.state.participantRace === "other" ? (
              <div className="form-left secondary other">
                <h5 className="form-label">Other race</h5>
                <input
                  type="text"
                  value={this.state.participantOtherRace}
                  onChange={this.setParticipantOtherRace}
                  disabled={this.state.disabledOtherRace}
                />
              </div>
            ) : (
              <div />
            )}
          </div>

          <div className="form-field-container">
            <div className="form-left secondary">
              <h5 className="form-label">Age</h5>
              <input
                type="number"
                value={this.state.participantAge}
                onChange={this.setParticipantAge}
                disabled={this.state.disabledAge}
              />
            </div>
            <div className="form-left secondary">
              <h5 className="form-label">Zip code</h5>
              <input
                type="number"
                value={this.state.zipcode}
                onChange={this.setParticipantZipcode}
                disabled={this.state.disabledZipcode}
              />
            </div>
          </div>

          <div className="form-field-container">
            <div className="form-left secondary">
              <h5 className="form-label">Email</h5>
              <input
                type="email"
                value={this.state.participantEmail}
                onChange={this.setParticipantEmail}
                disabled={this.state.disabledEmail}
              />
            </div>
          </div>

          <button className="button" onClick={this.props.restartQuiz}>
            Submit
          </button>
        </div>
      );
    }
  }

  render() {
    return (
      <div id="result" className="card-form">
        {this.renderResult()}
      </div>
    );
  }
}

Result.propTypes = {
  quizResult: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  restartQuiz: PropTypes.func.isRequired,
  answers: PropTypes.array.isRequired,
  kiosk: PropTypes.bool.isRequired,
  quizType: PropTypes.string.isRequired,
  participant: PropTypes.object.isRequired
};

export default Result;
