import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
   /* Your Firebase SDK Config goes here */
};
firebase.initializeApp(config);

export default firebase;
