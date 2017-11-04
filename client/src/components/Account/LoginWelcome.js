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
import { View, Text, Image } from 'react-native';
import { Pages } from 'react-native-pages';
import { GradientButton } from '../common';
import { loginStyles } from './LoginPage';

const fotaLogo = require('../../img/fota_logo.png');
const slide1 = require('../../img/1.png');
const slide2 = require('../../img/2.png');
const slide3 = require('../../img/3.png');
const slide4 = require('../../img/4.png');

const Graphic = (props) => (
  <View style={styles.swipeContainerStyle}>
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Image source={props.source} style={styles.graphicStyle} resizeMode='contain' />
    </View>
    <Text style={styles.captionStyle}>{props.text}</Text>
  </View>
);

class LoginWelcome extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={loginStyles.pageStart}>
          <Image style={styles.logoStyle} source={fotaLogo} resizeMode='contain' />
        </View>


        <Pages indicatorColor='#ff7f00' >
          <Graphic source={slide1} text='See the best food' />
          <Graphic source={slide2} text='Food near you' />
          <Graphic source={slide3} text='Streamlined restaurant info' />
          <Graphic source={slide4} text='User uploaded community' />
        </Pages>

        <View style={loginStyles.pageEnd}>
          {/* <View style={styles.buttonHolderStyle}>
            <Button
              onPress={this.logInWithFacebook.bind(this)}
              colors={{ text: '#fff', fill: '#ff7f00', border: '#ff7f00' }}
              text={'Continue with Facebook'}
              round
            >
              <Icon
                name='facebook'
                backgroundColor='transparent'
                color='white'
                style={{ paddingRight: 15 }}
                size={18}
              />
            </Button>
          </View> */}

          <View style={{ marginVertical: 10 }}>
            <GradientButton
              onPress={() => this.props.navigation.navigate('Signup')}
              colors={['#ff5b14', '#fe7d20']}
              text={'GET STARTED'}
            />
          </View>

          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Text>
              <Text style={styles.loginTextStyle}>Already have an account? </Text>
              <Text
                style={[styles.loginTextStyle, { textDecorationLine: 'underline' }]}
                onPress={() => this.props.navigation.navigate('Login')}
              >
                Log in here.
              </Text>
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  logoStyle: {
    width: 135,
    height: 45,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 30
  },
  swipeContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  graphicStyle: {
    height: 250,
    width: 250
  },
  captionStyle: {
    fontSize: 20,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.7)',
    marginBottom: 50,
  },
  loginTextStyle: {
    fontSize: 13,
    fontWeight: '300',
    color: 'rgba(0,0,0,0.4)',
  }
};

export default LoginWelcome;
