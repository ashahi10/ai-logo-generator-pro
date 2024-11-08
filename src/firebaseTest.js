import app from "./firebase"; // import the Firebase app from firebase.js
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

function testFirebaseSetup() {
  if (app) {
    console.log("Firebase initialized successfully!");
  } else {
    console.error("Firebase initialization failed.");
  }

  if (auth) {
    console.log("Firebase Auth is ready to use.");
  } else {
    console.error("Firebase Auth is not set up correctly.");
  }

  if (db) {
    console.log("Firebase Firestore is ready to use.");
  } else {
    console.error("Firebase Firestore is not set up correctly.");
  }
}

testFirebaseSetup();
