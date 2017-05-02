import React from 'react';
import { View, Text } from 'react-native';
import LoginForm from '../Account/LoginForm';

const openCamera = (navigator) => {
  navigator.replace({ id: 0 });
};

const CameraLoginForm = (props) => (
  <View style={styles.fadeStyle}>
    <View style={styles.pageStyle}>
      <Text style={styles.textStyle}>Please log in to upload photos.</Text>
      <LoginForm onLoginFinished={() => openCamera(props.navigator)} />
    </View>
  </View>
);

const styles = {
  textStyle: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 10
  },
  fadeStyle: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  pageStyle: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 20,
    padding: 5,
    paddingBottom: 15
  }
};

export default CameraLoginForm;
