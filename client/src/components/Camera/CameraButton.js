import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ImageButton } from '../common';
import { tabStyle } from './CameraPage';

const buttonImage = require('../../img/camera_button.png');

class CameraButton extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    tabBarIcon: ({ focused }) => {
      let color = 'rgba(0,0,0,0.23)';
      if (focused) color = '#ff9700';
      return (
          <Text
            onPress={() => {
              if (!focused) {
                screenProps.showCamera(true);
                navigation.navigate('Photo');
              }
            }}
            style={{ color, ...tabStyle }}
          >
            PHOTO
          </Text>
      );
    }
  });

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
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraButtonStyle: {
    width: 70,
    height: 70
  }
};

export default CameraButton;
