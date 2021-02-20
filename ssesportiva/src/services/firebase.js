import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyB8bSuyR3pdsPQexctwidYetQyGwsMGu0U',
  authDomain: 'betting-system-2021.firebaseapp.com',
  databaseURL: 'https://betting-system-2021-default-rtdb.firebaseio.com',
  projectId: 'betting-system-2021',
  storageBucket: 'betting-system-2021.appspot.com',
  messagingSenderId: '366249710853',
  appId: '1:366249710853:web:b583249338f05f201cd36c',
  measurementId: 'G-CBE2E23M3J',
};

firebase.initializeApp(firebaseConfig);
if (process.env.REACT_APP_USE_FIREBASE_EMULATOR) {
  console.log('Using Firebase Emulator');
  firebase.functions().useEmulator('localhost', 5001);
}

export default firebase;
