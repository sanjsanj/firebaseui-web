import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { auth } from "firebase";

import { mergeUser, addValueToUser, getRandNumber } from "./firebase";
import "./firebase";

class App extends React.Component {
  // getRandNumber = getRandNumber.bind(this);

  // The component's Local state.
  state = {
    responseToPost: "",
    isSignedIn: false,
    response: "",
    post: "",
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

    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  callApi = async () => {
    const response = await fetch("/api/hello");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch("/api/world", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    this.setState({ responseToPost: body });
  };

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

        <hr />

        <p>{this.state.response}</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <p>{this.state.responseToPost}</p>
      </div>
    );
  }
}

export default App;
