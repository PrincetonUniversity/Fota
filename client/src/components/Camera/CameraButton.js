import React, { Component } from 'react';
import { View } from 'react-native';
import { ImageButton } from '../common';

const buttonImage = require('../../img/camera_button.png');

class CameraButton extends Component {
  render() {
    return (
      <View style={styles.containerStyle}>
        <ImageButton
          source={buttonImage}
          style={styles.cameraButtonStyle}
          onPress={this.props.screenProps.takePicture}
        />
      </View>
    );
  }
}

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
