import { AppRegistry } from 'react-native';
import firebase from 'firebase';
import App from './src/App';

firebase.initializeApp({
  apiKey: 'AIzaSyAJMer5xB3fSdiP9S_WeDXy4nwFQnLOx7Q',
  authDomain: 'fota-69b9b.firebaseapp.com',
  databaseURL: 'https://fota-69b9b.firebaseio.com',
  projectId: 'fota-69b9b',
  storageBucket: 'fota-69b9b.appspot.com',
  messagingSenderId: '1064532334875'
});

AppRegistry.registerComponent('Fota', () => App);
