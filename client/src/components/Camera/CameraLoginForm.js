import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { ImageButton } from '../common';
import LoginForm from '../Account/LoginForm';
import { setCameraState } from '../../actions';

const openCamera = (navigator) => {
  navigator.replace({ id: 0 });
};

const CameraLoginForm = (props) => (
  <View style={styles.fadeStyle}>
    <View style={styles.pageStyle}>
      <Text style={styles.textStyle}>Please log in to upload photos.</Text>
      <LoginForm onLoginFinished={() => openCamera(props.navigator)} />
      <ImageButton
        style={styles.backArrowStyle}
        source={require('../../img/exit_button.png')}
        onPress={() => props.setCameraState(false)}
      />
    </View>
  </View>
);

const styles = {
  backArrowStyle: {
    left: 5,
    top: 5,
    height: 30,
    width: 30,
    position: 'absolute'
  },
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

export default connect(null, { setCameraState })(CameraLoginForm);
