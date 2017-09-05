/******************************************************************************
 * Called by: actions/index, Account/LoginForm, Account/UserPage,
 * Camera/CameraCommentsPage, Camera/CameraLocationPage, Photo/PhotoDetail,
 * Photo/PhotoList, Restaurant/CommentUpload, Restaurant/RestaurantDetail,
 * Search/SearchPage
 * Dependencies: axios
 *
 * Description: Helper file to communicate with the server through a RESTful
 * API. Functions include get, post, patch, put, delete, showErrorAlert.
 *
 ******************************************************************************/

import { Alert, NetInfo, AsyncStorage } from 'react-native';
import axios from 'axios';
import firebase from 'firebase';

function isNetworkConnected() {
  return NetInfo.getConnectionInfo().then(reachability => {
    // if (reachability.type === 'unknown') {
    //   return new Promise(resolve => {
    //     const handleFirstConnectivityChangeIOS = isConnected => {
    //       NetInfo.isConnected.removeEventListener('change', handleFirstConnectivityChangeIOS);
    //       resolve(isConnected);
    //     };
    //     NetInfo.isConnected.addEventListener('change', handleFirstConnectivityChangeIOS);
    //   });
    // }
    const r = reachability.type.toLowerCase();
    return (r !== 'none' && r !== 'unknown');
  });
}

function request(method, url, data, resolve, reject) {
  isNetworkConnected().then(isConnected => {
    if (isConnected) {
      AsyncStorage.getItem('JWT').then((idToken) => {
        axios({ method, url, data, headers: { Authorization: `Bearer ${idToken}` } })
        .then(response => resolve(response))
        .catch(e => {
          if (e.response.status === 401) {
            firebase.auth().currentUser.getToken(true).then((idTokenNew) => {
              AsyncStorage.setItem('JWT', idTokenNew);
              axios({ method, url, data, headers: { Authorization: `Bearer ${idTokenNew}` } })
              .then(response => resolve(response))
              .catch(e3 => reject({ etype: 1, ...e3 }));
            })
            .catch(e2 => reject({ etype: 1, ...e2 }));
          } else {
            reject({ etype: 1, ...e });
          }
        });
      });
    } else {
      reject({ etype: 0 });
    }
  }).catch(e => console.log(e));
}

const exports = module.exports = {};

exports.get = (url) => (
  new Promise((resolve, reject) => {
    request('get', url, null, resolve, reject);
  })
);

exports.post = (url, data = null) => (
  new Promise((resolve, reject) => {
    request('post', url, data, resolve, reject);
  })
);

exports.patch = (url, data = null) => (
  new Promise((resolve, reject) => {
    request('patch', url, data, resolve, reject);
  })
);

exports.put = (url, data = null) => (
  new Promise((resolve, reject) => {
    request('put', url, data, resolve, reject);
  })
);

exports.delete = (url, data = null) => (
  new Promise((resolve, reject) => {
    request('delete', url, data, resolve, reject);
  })
);

/*exports.cancel = () => {
  if (cancel !== undefined) {
    cancel();
  }
};*/

exports.showErrorAlert = (error) => {
  if (error.etype === 0) {
    Alert.alert(
      'No Connection',
      'You are not online right now. Please connect to the Internet and try again.',
      [{ text: 'OK' }]
    );
  } else if (error.etype === 1) {
    Alert.alert(
      'Server Error',
      'Something went wrong. Please try again.',
      [{ text: 'OK' }]
    );
  }
};
