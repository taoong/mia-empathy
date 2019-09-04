import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
    apiKey: "AIzaSyCHB1ytyh_ks-Ts3Vfao3JHKCcuDDekxH4",
    authDomain: "empathy3-df99f.firebaseapp.com",
    databaseURL: "https://empathy3-df99f.firebaseio.com",
    projectId: "empathy3-df99f",
    storageBucket: "empathy3-df99f.appspot.com",
    messagingSenderId: "63510853296",
    appId: "1:63510853296:web:4a4ff14436a08454"
};
firebase.initializeApp(config);

export default firebase;
