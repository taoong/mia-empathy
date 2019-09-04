import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
   /* Insert your Firebase Config here */
};
firebase.initializeApp(config);

export default firebase;
