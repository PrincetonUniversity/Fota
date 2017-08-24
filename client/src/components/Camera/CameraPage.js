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
import { View, Text, Dimensions, AsyncStorage, Alert, LayoutAnimation } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { TabNavigator, TabBarTop } from 'react-navigation';
import Camera, { constants } from 'react-native-camera';
// eslint-disable-next-line
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'react-native-fetch-blob';
import CameraButton from './CameraButton';
import CameraLibrary from './CameraLibrary';
import { Header } from '../common/';

export const tabStyle = {
    height: 35,
    width: (Dimensions.get('window').width / 2),
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    paddingTop: 7,
    paddingBottom: 0
};

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
} = styles;

export function cameraErrorAlert() {
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
  state = { showCamera: true };

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  takePicture() {
    this.camera.capture().then(data => {
      this.resizeImage(data.path, true);
    }).catch(() => cameraErrorAlert());
  }

  choosePhoto(uri) {
    this.resizeImage(uri, false);
  }

  resizeImage(uri, del) {
    ImageResizer.createResizedImage(uri, 800, 1600, 'JPEG', 100).then(reuri => {
      if (del) {
        deleteImage(uri);
      }
      AsyncStorage.setItem('UploadPath', reuri);
      this.props.navigation.navigate('Location');
    }).catch(() => cameraErrorAlert());
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
  }

  render() {
    return (
      <View style={pageStyle}>
        <Header>
          <Text style={headerTextStyle}>Add a Photo</Text>
          <View style={{ position: 'absolute', left: 10 }}>
            <Ionicon.Button
              name='md-close'
              backgroundColor='white'
              color='black'
              size={20}
              onPress={() => {
                this.props.screenProps.goBack();
              }}
            />
          </View>
        </Header>

        {this.renderCamera()}

        <PictureNavigator
          screenProps={{
            takePicture: this.takePicture.bind(this),
            choosePhoto: this.choosePhoto.bind(this),
            showCamera: (showCamera) => this.setState({ showCamera })
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
  swipeEnabled: false,
  animationEnabled: false,
  backBehavior: 'none',
  tabBarOptions: {
    showIcon: true,
    showLabel: false,
    iconStyle: {
      width: tabStyle.width,
      height: tabStyle.height,
    },
    tabStyle: {
      height: tabStyle.height + 5,
    },
    indicatorStyle: {
      height: 3,
      backgroundColor: '#ff9700',
      position: 'absolute',
      top: 0,
      zIndex: 3
    },
    style: {
      elevation: 0,
      backgroundColor: 'white',
      height: tabStyle.height + 5
    }
  }
});

export default CameraPage;
