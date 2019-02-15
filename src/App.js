import React, { Component } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";

import "./App.css";
import "./firebase";
import { mergeUser, addValueToUser, getRandNumber } from "./firebase";

class SignInScreen extends React.Component {
  getRandNumber = getRandNumber.bind(this);

  // The component's Local state.
  state = {
    isSignedIn: false, // Local signed-in state.
    rand: 0,
  };

  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false,
    },
  };

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this.unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(async user => {
        if (!user) return;

        console.log(user);
        mergeUser(user);

        this.setState({
          isSignedIn: !!user,
        });

        this.getRandNumber(user.uid);
      });
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    if (!this.state.isSignedIn) {
      return (
        <div>
          <h1>My App</h1>
          <p>Please sign-in:</p>
          <StyledFirebaseAuth
            uiConfig={this.uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </div>
      );
    }
    return (
      <div>
        <h1>My App</h1>
        <p>
          Welcome {firebase.auth().currentUser.displayName}! You are now
          signed-in!
        </p>

        <button onClick={() => firebase.auth().signOut()}>Sign-out</button>

        <h2>Save random number</h2>
        <button
          onClick={() =>
            addValueToUser(firebase.auth().currentUser.uid, Math.random())
          }
        >
          Save!
        </button>
        <p>Saved number is {this.state.rand}</p>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <SignInScreen />
        </header>
      </div>
    );
  }
}

export default App;
