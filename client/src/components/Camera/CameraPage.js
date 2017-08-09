/******************************************************************************
 * Called by: CameraCommentsPage, CameraLocationPage, CameraNavigator
 * Dependencies: redux, react-native-camera, ImageResizer, RNFetchBlob,
 * common/Header, common/ImageButton, actions/setCameraState
 *
 * Description: Step 1 of 3 in uploading a photo. Displays the camera to the
 * user. Exiting the camera brings the user back to the previous page the user
 * was at, and taking a picture brings the user to the location page
 * (./CameraLocationPage).
 *
 * Bugs/Todo: Resizing images on front end takes a long time. When pressing
 * cancel, figure out how to change from .navigate('Home') to
 * .dispatch(backAction) or .goBack()
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { View, Text, Dimensions, AsyncStorage, Alert } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import Camera, { constants } from 'react-native-camera';
// eslint-disable-next-line
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
    fontSize: 17,
    fontWeight: '500',
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
    width: 80,
    height: 80
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
    this.props.navigation.navigate('Location');
  }

  render() {
    return (
      <View style={pageStyle}>
        <Header>
          <Ionicon.Button
            name='md-close'
            backgroundColor='white'
            color='black'
            size={20}
            onPress={() => this.props.setCameraState(false)}
          />
          <Text style={headerTextStyle}>Add a Photo</Text>
          <Ionicon.Button name='md-close' backgroundColor='white' color='white' size={20} />
        </Header>

        <Camera
          ref={(cam) => { this.camera = cam; }}
          style={cameraStyle}
          aspect={constants.Aspect.fill}
          captureTarget={constants.CaptureTarget.disk}
          onFocusChanged={() => {}}
          onZoomChanged={() => {}}
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
