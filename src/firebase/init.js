import firebase from 'firebase/app';
import firestore from 'firebase/firestore';  // eslint-disable-line
  
  var config = {
    apiKey: "AIzaSyBKWf1q7q8XWlicav1VyKOle-DMDNyfVTg",
    authDomain: "jinx-vue-pwa.firebaseapp.com",
    databaseURL: "https://jinx-vue-pwa.firebaseio.com",
    projectId: "jinx-vue-pwa",
    storageBucket: "",
    messagingSenderId: "98623874850"
  };

  const firebaseApp = firebase.initializeApp(config);
  firebaseApp.firestore().settings({ timestampsInSnapshots: true });
  export default firebaseApp.firestore();