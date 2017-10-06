import { Alert } from 'react-native';

const exports = module.exports = {};

const handleFailure = (showAlert, onPress) => {
  if (showAlert) {
    Alert.alert(
      'Location Error',
      'We had trouble finding your location. Please check your location settings and try again.',
      [{ text: 'OK', onPress }]
    );
  } else {
    onPress();
  }
};

exports.get = (onSuccess, onFail = () => {}, showAlert = true) => {
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; handleFailure(showAlert, onFail); }, 3000);
  navigator.geolocation.getCurrentPosition(
    position => { clearTimeout(timer); if (!timedOut) onSuccess(position); }, 
    () => { if (!timedOut) handleFailure(showAlert, onFail); }
    // options
  );
};
