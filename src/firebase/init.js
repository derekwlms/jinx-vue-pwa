import firebase from 'firebase/app';
import firestore from 'firebase/firestore';  // eslint-disable-line
import localConfig from './local-config';
import extend from 'lodash/extend';
  
  var config = {
    apiKey: "your-api-key-here",
    authDomain: "your-domain-here",
    databaseURL: "your-url-here",
    projectId: "jinx-vue-pwa",
    storageBucket: "",
    messagingSenderId: "your-sender-id-here"
  };
  extend(config, localConfig);

  const firebaseApp = firebase.initializeApp(config);
  firebaseApp.firestore().settings({ timestampsInSnapshots: true });
  export default firebaseApp.firestore();