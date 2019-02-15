import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyBgKK4j2ZyI4ukxJUbXybX0XR-WqIYe-vc",
  authDomain: "gatsby-firebase-b23a5.firebaseapp.com",
  projectId: "gatsby-firebase-b23a5",
};

firebase.initializeApp(config);

export function mergeUser(user) {
  const db = firebase.firestore();
  db.collection("users")
    .doc(user.displayName)
    .set({ uid: user.uid }, { merge: true });
}
