import React from 'react';
import { View } from 'react-native';
import { ImageButton } from '../common';

const buttonImage = require('../../img/camera_button.png');

const CameraButton = (props) => (
  <View style={styles.containerStyle}>
    <ImageButton
      source={buttonImage}
      style={styles.cameraButtonStyle}
      onPress={props.screenProps.takePicture}
    />
  </View>
);

const styles = {
  containerStyle: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraButtonStyle: {
    width: 70,
    height: 70
  }
};

export default CameraButton;
