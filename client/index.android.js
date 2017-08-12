import { AppRegistry } from 'react-native';
import firebase from 'firebase';
import App from './src/App';

// firebase.initializeApp({
//   apiKey: 'AIzaSyAJMer5xB3fSdiP9S_WeDXy4nwFQnLOx7Q',
//   authDomain: 'fota-69b9b.firebaseapp.com',
//   databaseURL: 'https://fota-69b9b.firebaseio.com',
//   projectId: 'fota-69b9b',
//   storageBucket: 'fota-69b9b.appspot.com',
//   messagingSenderId: '1064532334875'
// });

firebase.initializeApp({
  apiKey: 'AIzaSyDkX4Zw9aoBGr-ovNl9w62IPCL3ag301bo',
  authDomain: 'fotabackend-173714.firebaseapp.com',
  databaseURL: 'https://fotabackend-173714.firebaseio.com',
  projectId: 'fotabackend-173714',
  storageBucket: 'fotabackend-173714.appspot.com',
  messagingSenderId: '363515977130'
});

AppRegistry.registerComponent('Fota', () => App);
