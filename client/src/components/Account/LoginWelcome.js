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
import { View, Text, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'firebase';
import { Button } from '../common';
import { loginStyles } from './LoginPage';

const fotaLogo = require('../../img/fota_home_activated.png');

class LoginWelcome extends Component {
  logInWithFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(result => {
      console.log(result.user);
      //this.props.screenProps.onLoginFinished();
    }).catch(error => {
      Alert.alert(
        'Error',
        error.message,
        [{ text: 'OK' }]
      );
    });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={loginStyles.pageStart}>
          <Image style={styles.logoStyle} source={fotaLogo} />
          <Text style={styles.titleStyle}>FOTA</Text>
          <Text style={styles.subtitleStyle}>See what's popping.</Text>
        </View>

        <View style={loginStyles.pageEnd}>
          <View style={styles.buttonHolderStyle}>
            <Button
              onPress={this.logInWithFacebook.bind(this)}
              colors={{ text: '#fff', fill: '#ff9700', border: '#ff9700' }}
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

          </View>
          <View style={styles.buttonHolderStyle}>
            <Button
              onPress={() => this.props.navigation.navigate('Signup')}
              colors={{ text: 'rgba(0, 0, 0, 0.6)', fill: '#fff', border: 'rgba(0, 0, 0, 0.6)' }}
              text={'Create an Account'}
              round
            />
          </View>

          <View style={styles.textHolderStyle}>
            <Text
              style={styles.loginTextStyle}
              onPress={() => this.props.navigation.navigate('Login')}
            >
              Log in
            </Text>
            <Text
              style={styles.skipTextStyle}
              onPress={this.props.screenProps.onSkip.bind(this)}
            >
              Not now
            </Text>
          </View>
        </View>

      </View>
    );
  }
}

const styles = {
  logoStyle: {
    width: 40,
    height: 40
  },
  titleStyle: {
    fontSize: 32,
    fontWeight: '900',
    color: 'rgba(0, 0, 0, 0.8)',
    marginTop: 20,
    marginBottom: 10
  },
  subtitleStyle: {
    fontSize: 20,
    fontWeight: '300',
    color: 'rgba(0, 0, 0, 0.6)',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.3)'
  },
  loginTextStyle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#ff9700',
  },
  skipTextStyle: {
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.6)',
    position: 'absolute',
    right: 0
  },
  buttonHolderStyle: {
    flexDirection: 'row',
    marginVertical: 10
  },
  textHolderStyle: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center'
  }
};

export default LoginWelcome;
