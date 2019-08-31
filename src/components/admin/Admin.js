import React, { Component } from "react";
import firebase from "../../Firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import Nav from "./Nav";
import { Route } from "react-router-dom";
import AdminHome from "./AdminHome";
import Sessions from "./Sessions";
import NewSession from "./NewSession";
import Quizzes from "./Quizzes";
import NewQuiz from "./NewQuiz";
import Loading from "../other/Loading";

class Admin extends Component {
  state = { user: null, isSignedIn: false, verified: false, loading: true };
  admins = firebase.firestore().collection("admins");

  /**
   * Used for configuring FirebaseAuth.
   */
  uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false
    }
  };

  /**
   * Sets up an auth observer to handle whether a user is signed in.
   */
  componentDidMount() {
    // Detect if any user is signed in
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      this.setState({ user: user, isSignedIn: !!user });
      // Verify if a user is currently signed in
      if (user != null) {
        this.verify();
      }
      // Otherwise, indicate that no user is signed in
      else {
        this.setState({ isSignedIn: false, verified: false, loading: false });
      }
    });
  }

  /**
   * Unregisters the Firebase auth observer when the component is unmounted.
   */
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  /**
   * Signs out the current user.
   */
  signOut = () => {
    firebase.auth().signOut();
  };

  /**
   * Checks that the current user exists in the database, then updates state accordingly.
   */
  verify = () => {
    const currentComponent = this;
    if (firebase.auth().currentUser != null) {
      this.admins
        .where("email", "==", firebase.auth().currentUser.email)
        .get()
        // If a match for the user email was found in Firebase, update state accordingly
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            currentComponent.setState({ verified: true });
          });
        })
        // Set loading to false so that the loading screen isn't rendered
        .then(() => {
          currentComponent.setState({ loading: false });
        })
        .catch(function(error) {
          console.log("Could not verify admin: ", error);
        });
    }
  };

  /**
   * Directs to the correct render method depending on user status.
   * @returns {JSX} Sign-in or unverified user screens.
   */
  handleInvalidUser() {
    // No current user signed in
    if (!this.state.isSignedIn) {
      return <div>{this.renderSignIn()}</div>;
    }

    // The user hasn't been verified
    if (this.state.isSignedIn && !this.state.verified) {
      this.verify();
      return <div>{this.renderUnverified()}</div>;
    }
  }

  /**
   * Render method for the loading screen.
   * @returns {JSX} Loading screen.
   */
  renderLoading() {
    return <Loading />;
  }

  /**
   * Renders the sign-in screen.
   * @returns {JSX} The sign-in screen.
   */
  renderSignIn() {
    return (
      <div className="card-form">
        <h1>Mia Empathy Tool Admin Sign-in</h1>
        <StyledFirebaseAuth
          uiConfig={this.uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </div>
    );
  }

  /**
   * Renders a card indicating that the user is unverified.
   * @returns {JSX} Unverified user screen.
   */
  renderUnverified() {
    return (
      <div className="card-form">
        <h3>
          Your email (
          {firebase.auth().currentUser ? firebase.auth().currentUser.email : ""}
          ) has not been verified!
        </h3>
        <h5>
          Please email taoong.96@gmail.com if you think this is a mistake.
        </h5>
        <button className="button" onClick={this.signOut}>
          Sign-out
        </button>
      </div>
    );
  }

  /**
   * Routing for the admin-side.
   * @returns {JSX} All admin-side routing for a logged in admin.
   */
  renderAdmin() {
    return (
      <div id="admin">
        <Nav signout={this.signOut} />
        <Route exact path={this.props.match.path} component={AdminHome} />
        <Route
          exact
          path={`${this.props.match.path}/sessions`}
          component={Sessions}
        />
        <Route
          path={`${this.props.match.path}/sessions/new`}
          component={NewSession}
        />
        <Route
          path={`${this.props.match.path}/sessions/edit/:id`}
          component={NewSession}
        />
        <Route
          exact
          path={`${this.props.match.path}/quizzes`}
          component={Quizzes}
        />
        <Route
          path={`${this.props.match.path}/quizzes/new`}
          component={NewQuiz}
        />
        <Route
          path={`${this.props.match.path}/quizzes/edit/:id`}
          component={NewQuiz}
        />
      </div>
    );
  }

  /**
   * Displays different interfaces depending on user status.
   * @returns {JSX} All possible Admin component screens.
   */
  render() {
    // Loading...
    if (this.state.loading) {
      return <div>{this.renderLoading()}</div>;
    }

    // Invalid user screen
    if (!this.state.isSignedIn || !this.state.verified) {
      return <div>{this.handleInvalidUser()}</div>;
    }

    // Admin panel
    else {
      return <div>{this.renderAdmin()}</div>;
    }
  }
}

export default Admin;
