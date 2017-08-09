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
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from '../common';
import { loginStyles } from './LoginPage';

const fotaLogo = require('../../img/fota_home_activated.png');

class LoginWelcome extends Component {
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
              onPress={() => console.log('Facebook.')}
              colors={{ text: '#fff', fill: '#ff9700', border: '#ff9700' }}
              text={'Continue with Facebook'}
            >
              <Icon
                name='facebook'
                backgroundColor='rgba(255, 255, 255, 0.0)'
                color='white'
                style={{ paddingVertical: 15, paddingRight: 15 }}
                size={18}
              />
            </Button>

          </View>
          <View style={styles.buttonHolderStyle}>
            <Button
              onPress={() => this.props.navigation.navigate('Signup')}
              colors={{ text: '#888', fill: '#fff', border: '#aaa' }}
              text={'Create an Account'}
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
              onPress={() => console.log('Skip me!')}
            >
              Skip
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
    fontWeight: 'bold',
    color: '#444',
    fontFamily: 'Avenir',
    marginTop: 20,
    marginBottom: 10
  },
  subtitleStyle: {
    fontSize: 22,
    color: '#aaa',
    fontFamily: 'Avenir',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#bbb'
  },
  loginTextStyle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ff9700',
    fontFamily: 'Avenir',
  },
  skipTextStyle: {
    fontSize: 18,
    color: '#aaa',
    fontFamily: 'Avenir',
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
