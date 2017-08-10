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
import { View, Text, Dimensions, AsyncStorage, Alert, Image } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { TabNavigator, TabBarTop } from 'react-navigation';
import Camera, { constants } from 'react-native-camera';
// eslint-disable-next-line
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'react-native-fetch-blob';
import CameraButton from './CameraButton';
import CameraLibrary from './CameraLibrary';
import { Header } from '../common/';
import { setCameraState } from '../../actions';

const styles = {
  pageStyle: {
    flex: 1,
    flexDirection: 'column'
  },
  headerTextStyle: {
    fontSize: 17,
    fontWeight: '500',
    fontFamily: 'Avenir',
    color: '#444',
    textAlign: 'center',
    flex: 1,
  },
  nextTextStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute',
    right: 20
  },
  cameraStyle: {
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').width,
    alignSelf: 'center',
    backgroundColor: 'white'
  },
  imageStyle: {
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').width,
    resizeMode: 'cover'
  }
};

const {
  pageStyle,
  headerTextStyle,
  cameraStyle,
  imageStyle,
  nextTextStyle
} = styles;

const unselected = require('../../img/no_image_selected.png');

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
  state = { showCamera: true, selectedImage: unselected };

  takePicture() {
    this.camera.capture().then(data => {
      this.resizeImage(data.path, true);
    }).catch(() => cameraErrorAlert());
  }

  choosePhoto(uri) {
    if (uri === this.state.selectedImage.uri) {
      this.setState({ selectedImage: unselected });
    } else {
      this.setState({ selectedImage: { uri } });
    }
  }

  resizeImage(uri, del) {
    ImageResizer.createResizedImage(uri, 800, 1600, 'JPEG', 100).then(reuri => {
      if (del) {
        console.log(uri);
        deleteImage(uri);
      }
      AsyncStorage.setItem('UploadPath', reuri);
      this.props.navigation.navigate('Location');
    }).catch(() => cameraErrorAlert());
  }

  renderNextButton() {
    if (!this.state.showCamera) {
      if (this.state.selectedImage === unselected) {
        return <Text style={{ color: '#aaa', ...nextTextStyle }}>NEXT</Text>;
      }
      return (
        <Text
          style={{ color: '#0097ff', ...nextTextStyle }}
          onPress={() => this.resizeImage(this.state.selectedImage.uri, false)}
        >
          NEXT
        </Text>
      );
    }
  }

  renderCamera() {
    if (this.state.showCamera) {
      return (
        <Camera
          ref={(cam) => { this.camera = cam; }}
          style={cameraStyle}
          aspect={constants.Aspect.fill}
          captureTarget={constants.CaptureTarget.disk}
          onFocusChanged={() => {}}
          onZoomChanged={() => {}}
        />
      );
    }
    return (
      <Image
        source={this.state.selectedImage}
        style={imageStyle}
      />
    );
  }

  render() {
    return (
      <View style={pageStyle}>
        <Header>
          <Text style={headerTextStyle} onPress={() => this.setState({ showCamera: !this.state.showCamera })}>Add a Photo</Text>
          <View style={{ position: 'absolute', left: 10 }}>
            <Ionicon.Button
              name='md-close'
              backgroundColor='white'
              color='black'
              size={20}
              onPress={() => this.props.setCameraState(false)}
            />
          </View>
          {this.renderNextButton()}
        </Header>

        {this.renderCamera()}

        <PictureNavigator
          screenProps={{ 
            takePicture: this.takePicture.bind(this),
            choosePhoto: this.choosePhoto.bind(this)
          }} 
        />
    </View>
    );
  }
}

const PictureNavigator = TabNavigator({
  Photo: {
    screen: CameraButton
  },
  Library: {
    screen: CameraLibrary
  }
},
{
  tabBarPosition: 'top',
  tabBarComponent: TabBarTop,
  tabBarOptions: {
    activeTintColor: '#ff9700',
    inactiveTintColor: '#ccc',
    labelStyle: {
      fontSize: 14,
      fontWeight: '500',
      marginVertical: 2
    },
    indicatorStyle: {
      height: 3,
      backgroundColor: '#ff9700',
      position: 'absolute',
      top: 0
    },
    style: { elevation: 0, backgroundColor: 'white' }
  }
});

export default connect(null, { setCameraState })(CameraPage);
