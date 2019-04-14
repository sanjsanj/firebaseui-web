import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import React, { Component } from "react";
import { auth } from "firebase";

import { mergeUser, addValueToUser, getRandNumber } from "./firebase";
import "./firebase";
import "./App.css";

class SignInScreen extends React.Component {
  // getRandNumber = getRandNumber.bind(this);

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
      auth.FacebookAuthProvider.PROVIDER_ID,
      auth.TwitterAuthProvider.PROVIDER_ID,
      auth.GoogleAuthProvider.PROVIDER_ID,
      auth.EmailAuthProvider.PROVIDER_ID,
      auth.PhoneAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false,
    },
  };

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this.unregisterAuthObserver = auth().onAuthStateChanged(async user => {
      if (!user) return;

      console.log(user);
      mergeUser(user);

      this.setState({
        isSignedIn: !!user,
      });

      getRandNumber(user.uid, this.setState.bind(this));
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
          <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={auth()} />
        </div>
      );
    }
    return (
      <div>
        <h1>My App</h1>
        <p>Welcome {auth().currentUser.displayName}! You are now signed-in!</p>

        <button onClick={() => auth().signOut()}>Sign-out</button>

        <h2>Save random number</h2>
        <button
          onClick={() => addValueToUser(auth().currentUser.uid, Math.random())}
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
