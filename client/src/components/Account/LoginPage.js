/******************************************************************************
 * Called by: ./AccountPage, Camera/CameraLoginForm, CameraNavigator
 * Dependencies: firebase, helpers/axioshelper, common/CardSection,
 * common/Button, common/Input, common/Spinner
 *
 * Description: Called when the user tries to access the account page
 * (./AccountPage) or the camera page (Camera/CameraNavigator) without being
 * logged in. Promps the user for a username and a password, with options to
 * log in or sign up. Displays as a page on the account page and a pop-up on
 * the camera page.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { StackNavigator } from 'react-navigation';
import LoginWelcome from './LoginWelcome';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

class LoginPage extends Component {
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <LoginNavigator />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const LoginNavigator = StackNavigator({
  Welcome: {
    screen: LoginWelcome
  },
  Login: {
    screen: LoginForm
  },
  Signup: {
    screen: SignupForm
  }
},
{
  headerMode: 'none',
  cardStyle: {
    backgroundColor: '#fff'
  }
});

export const loginStyles = {
  pageStart: {
    marginHorizontal: 50,
    marginTop: 35
  },
  pageEnd: {
    marginHorizontal: 50,
    marginBottom: 35
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 15
  },
  headerText: {
    fontFamily: 'Avenir',
    color: '#444',
    fontSize: 25,
    fontWeight: '500',
    paddingVertical: 5,
  },
  small: {
    marginTop: 10,
    fontFamily: 'Avenir',
    color: '#aaa',
    fontSize: 14
  }
};

export default LoginPage;
