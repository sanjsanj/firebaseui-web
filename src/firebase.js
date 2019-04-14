import { initializeApp, firestore } from "firebase";

const config = {
  apiKey: "AIzaSyBgKK4j2ZyI4ukxJUbXybX0XR-WqIYe-vc",
  authDomain: "gatsby-firebase-b23a5.firebaseapp.com",
  projectId: "gatsby-firebase-b23a5",
};

initializeApp(config);
const db = firestore();

export function mergeUser({ uid, displayName, email, photoURL }) {
  db.collection("users")
    .doc(uid)
    .set({ uid, displayName, email, photoURL }, { merge: true });
}

export function addValueToUser(uid, value) {
  db.collection("users")
    .doc(uid)
    .set({ rand: value }, { merge: true });
}

export async function getRandNumber(uid, setState) {
  db.collection("users")
    .doc(uid)
    .onSnapshot(doc => setState({ rand: doc.data().rand }));
}
