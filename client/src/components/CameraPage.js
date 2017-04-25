import React, { Component } from 'react';
import { View, Text, Dimensions, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import Camera from 'react-native-camera';
import { ImageButton } from './common/';
import { setCameraState } from '../actions';

const styles = {
  pageStyle: {
    flex: 1,
    flexDirection: 'column'
  },
  headerStyle: {
    height: 40,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20
  },
  headerTextStyle: {
    fontSize: 15,
    fontFamily: 'Avenir'
  },
  cameraStyle: {
    height: Dimensions.get('window').width,
    backgroundColor: 'black'
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

const { pageStyle,
        headerStyle,
        headerTextStyle,
        cameraStyle,
        footerStyle,
        cameraButtonStyle
      } = styles;

const cameraButton = require('../img/camera_button.png');

class CameraPage extends Component {
  takePicture() {
    this.camera.capture()
     .then((data) => {
       AsyncStorage.setItem('UploadPath', data.path);
       this.renderUploadLocation();
     })
     .catch(err => console.error(err));
  }

  renderUploadLocation() {
    this.props.navigator.replace({ id: 1 });
  }

  render() {
    return (
      <View style={pageStyle}>
        <View style={headerStyle}>
          <Text
            style={headerTextStyle}
            onPress={() => {
              this.props.setCameraState(false);
            }}
          >
            Cancel
          </Text>
        </View>

        <Camera
          ref={(cam) => { this.camera = cam; }}
          style={cameraStyle}
          captureTarget={Camera.constants.CaptureTarget.disk}
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
