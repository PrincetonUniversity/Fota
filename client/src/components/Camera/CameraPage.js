import React, { Component } from 'react';
import { View, Text, Dimensions, AsyncStorage, Alert } from 'react-native';
import { connect } from 'react-redux';
import Camera, { constants } from 'react-native-camera';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'react-native-fetch-blob';
import { Header, ImageButton } from '../common/';
import { setCameraState } from '../../actions';

const styles = {
  pageStyle: {
    flex: 1,
    flexDirection: 'column'
  },
  headerTextStyle: {
    fontSize: 15,
    fontFamily: 'Avenir'
  },
  cameraStyle: {
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').width,
    alignSelf: 'center',
    backgroundColor: 'white'
  },
  footerStyle: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraButtonStyle: {
    width: 100,
    height: 100
  }
};

const {
  pageStyle,
  headerTextStyle,
  cameraStyle,
  footerStyle,
  cameraButtonStyle
} = styles;

const cameraButton = require('../../img/camera_button.png');

function cameraErrorAlert() {
  Alert.alert(
    'Error',
    'Oops! Something went wrong. Please restart the app and try again.',
    [{ text: 'OK' }]
  );
}

export function deleteImage(path) {
  const filepath = path.replace(/^(file:)/, '');
  RNFetchBlob.fs.exists(filepath)
    .then((result) => {
      if (result) {
        return RNFetchBlob.fs.unlink(filepath)
          .catch(() => cameraErrorAlert());
      }
    })
    .catch(() => cameraErrorAlert());
}

class CameraPage extends Component {
  takePicture() {
    this.camera.capture().then(data => {
      ImageResizer.createResizedImage(data.path, 800, 1600, 'JPEG', 100).then(reuri => {
        deleteImage(data.path);
        AsyncStorage.setItem('UploadPath', reuri);
        this.renderCameraLocation();
      }).catch(() => cameraErrorAlert());
    }).catch(() => cameraErrorAlert());
  }

  renderCameraLocation() {
    this.props.navigator.replace({ id: 1 });
  }

  render() {
    return (
      <View style={pageStyle}>
        <Header>
          <Text
            style={headerTextStyle}
            onPress={() => this.props.setCameraState(false)}
          >
            Cancel
          </Text>
        </Header>

        <Camera
          ref={(cam) => { this.camera = cam; }}
          style={cameraStyle}
          aspect={constants.Aspect.fill}
          captureTarget={constants.CaptureTarget.disk}
        />

        <View style={footerStyle}>
          <ImageButton
            source={cameraButton}
            style={cameraButtonStyle}
            onPress={this.takePicture.bind(this)}
          />
        </View>
    </View>
    );
  }
}

export default connect(null, { setCameraState })(CameraPage);
