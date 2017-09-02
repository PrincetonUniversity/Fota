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
import {
  View, Dimensions, StatusBar, TouchableOpacity,
  Alert, UIManager, LayoutAnimation
} from 'react-native';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { TabNavigator, TabBarTop } from 'react-navigation';
import Camera, { constants } from 'react-native-camera';
// eslint-disable-next-line
import ImageResizer from 'react-native-image-resizer';
import CameraButton from './CameraButton';
import CameraLibrary from './CameraLibrary';
import { Header } from '../common/';
import icoMoonConfig from '../../selection.json';

const Icon = createIconSetFromIcoMoon(icoMoonConfig);

export const tabStyle = {
    height: 35,
    width: (Dimensions.get('window').width / 2),
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '900',
    paddingTop: 7,
    paddingBottom: 0
};

const styles = {
  pageStyle: {
    flex: 1,
    flexDirection: 'column'
  },
  cameraStyle: {
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').width,
    alignSelf: 'center',
    backgroundColor: 'white'
  },
  buttonContainerStyle: {
    backgroundColor: 'transparent',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3
  }
};

const {
  pageStyle,
  cameraStyle,
  buttonContainerStyle
} = styles;

export function cameraErrorAlert() {
  Alert.alert(
    'Error',
    'Oops! Something went wrong. Please restart the app and try again.',
    [{ text: 'OK' }]
  );
}

class CameraPage extends Component {
  constructor(props) {
    super(props);
    this.state = { showCamera: true };
    this.pictureTaken = false;
  }

  componentWillMount() {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  takePicture() {
    if (this.pictureTaken) return;
    this.pictureTaken = true;
    this.camera.capture().then(data => {
      this.resizeImage(data.path, true);
    }).catch(() => cameraErrorAlert());
  }

  choosePhoto(uri) {
    if (this.pictureTaken) return;
    this.pictureTaken = true;
    this.resizeImage(uri, false);
  }

  resizeImage(uri, del) {
    ImageResizer.createResizedImage(uri, 800, 1600, 'JPEG', 100).then(reuri => {
      this.props.navigation.navigate('Location', { full: uri, path: reuri, del });
      setTimeout(() => { this.pictureTaken = false; }, 200);
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
        <StatusBar hidden />
        <Header text='Add a Photo' iosHideStatusBar>
          <View style={{ position: 'absolute', left: 20 }}>
            <TouchableOpacity
              style={buttonContainerStyle}
              onPress={() => {
                this.props.screenProps.goBack();
              }}
            >
              <Icon
                name='close'
                backgroundColor='white'
                color='black'
                size={13}
              />
            </TouchableOpacity>
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
      overflow: 'hidden',
      height: tabStyle.height + 5
    }
  }
});

export default CameraPage;
