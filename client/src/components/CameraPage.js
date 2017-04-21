import React, { Component } from 'react';
import { View, Text, Dimensions, Modal } from 'react-native';
import { connect } from 'react-redux';
import Camera from 'react-native-camera';
import { ImageButton } from './common/';
import { setCameraState } from '../actions';
import UploadPage from './UploadPage';

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
        cameraStyle,
        footerStyle,
        cameraButtonStyle
      } = styles;

let PicturePath;
const cameraButton = require('../img/camera_button.png');

class CameraPage extends Component {
  state = { uploadPageVisible: false }

  closeModal() {
    this.setState({ uploadPageVisible: false });
  }

  takePicture() {
    this.camera.capture()
     .then((data) => { PicturePath = data.path; this.setState({ uploadPageVisible: true }); })
     .catch(err => console.error(err));
  }

  render() {
    console.log(cameraStyle.height);
    return (
      <View style={pageStyle}>
        <Modal
          visible={this.state.uploadPageVisible}
          onRequestClose={() => {
            PicturePath = null;
            this.closeModal();
          }}
        >
          <UploadPage
            photo={PicturePath}
            close={this.closeModal.bind(this)}
          />
        </Modal>

        <View style={headerStyle}>
          <Text
            onPress={() => {
              this.props.setCameraState(false);
            }}
          >
            Cancel
          </Text>
        </View>

        <Camera
          ref={(cam) => {
             this.camera = cam;
           }}
          style={cameraStyle}
          captureTarget={Camera.constants.CaptureTarget.disk}
        />

        <View
          style={footerStyle}
        >
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
