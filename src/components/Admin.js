import React, { Component } from "react";
import firebase from "../Firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import Nav from "./Nav";

class Admin extends Component {
  state = { user: null, isSignedIn: false, verified: false, loading: true };
  admins = firebase.firestore().collection("admins");

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
      .onAuthStateChanged(user =>
        this.setState({ user: user, isSignedIn: !!user })
      );
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  signOut = () => {
    firebase.auth().signOut();
  };

  verify = () => {
    const currentComponent = this;
    this.admins
      .where("email", "==", firebase.auth().currentUser.email)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          currentComponent.setState({ verified: true, loading: false });
        });
      })
      .catch(function(error) {
        console.log("Could not verify admin: ", error);
      });
  };

  handleInvalidUser() {
    if (!this.state.isSignedIn) {
      return <div>{this.renderSignIn()}</div>;
    } else if (this.state.isSignedIn && !this.state.verified) {
      this.verify();
      return <div>{this.renderUnverified()}</div>;
    }
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

  renderUnverified() {
    if (this.state.loading) {
      return (
        <div>
          <h1>Loading</h1>
        </div>
      );
    } else {
      return (
        <div className="card-form">
          <h3>
            Your email ({firebase.auth().currentUser.email}) has not been
            verified!
          </h3>
          <h5>
            Please contact taoong@berkeley.edu if you think this is a mistake.
          </h5>
          <button onClick={() => firebase.auth().signOut()}>Sign-out</button>
        </div>
      );
    }
  }

  renderLoading() {}

  renderAdmin() {
    console.log("Rendered admin");
    return (
      <div className="admin">
        <Nav signout={this.signOut} />
        <h1>Mia Empathy Tool</h1>
        <p>
          Welcome {firebase.auth().currentUser.displayName}! You are now
          signed-in!
        </p>
        <button onClick={() => this.signOut()}>Sign-out</button>
      </div>
    );
  }

  render() {
    if (!this.state.isSignedIn || !this.state.verified) {
      return <div>{this.handleInvalidUser()}</div>;
    } else {
      return <div>{this.renderAdmin()}</div>;
    }
  }
}

export default Admin;
