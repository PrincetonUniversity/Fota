import { Alert, NetInfo } from 'react-native';
import axios from 'axios';

function request(method, url, data, resolve, reject) {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      axios({ method, url, data })
        .then(response => resolve(response))
        .catch(e => {
          reject({ etype: 1, ...e });
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
