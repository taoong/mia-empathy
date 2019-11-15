import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyCKLScx-8SzmQCr6us-a7x598O1bmqu15M",
  authDomain: "mia-empathy.firebaseapp.com",
  databaseURL: "https://mia-empathy.firebaseio.com",
  projectId: "mia-empathy",
  storageBucket: "mia-empathy.appspot.com",
  messagingSenderId: "679221564571",
  appId: "1:679221564571:web:a9273dd883ecbf2b4e223e"
};
firebase.initializeApp(config);

export default firebase;
