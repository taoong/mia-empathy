import React, { Component } from "react";
import firebase from "../Firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

class Admin extends Component {
  state = { isSignedIn: false };

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

  componentDidMount() {
    this.unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(user => this.setState({ isSignedIn: !!user }));
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

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

  renderAdmin() {
    return (
      <div>
        <h1>Mia Empathy Tool</h1>
        <p>
          Welcome {firebase.auth().currentUser.displayName}! You are now
          signed-in!
        </p>
        <button onClick={() => firebase.auth().signOut()}>Sign-out</button>
      </div>
    );
  }

  render() {
    if (!this.state.isSignedIn) {
      return <div>{this.renderSignIn()}</div>;
    } else {
      return <div>{this.renderAdmin()}</div>;
    }
  }
}

export default Admin;
