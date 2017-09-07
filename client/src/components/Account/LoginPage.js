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
  static navigationOptions = {
    gesturesEnabled: false
  };

  render() {
    let screenProps = {
      onSkip: this.props.onSkip,
      onLoginFinished: this.props.onLoginFinished
    };
    if (this.props.navigation) {
      const goBack = () => this.props.navigation.goBack();
      const openCamera = () => this.props.navigation.navigate('Camera', { goBack });
      screenProps = { onSkip: goBack, onLoginFinished: goBack };
      if (this.props.navigation.state.params.onLoginFinished === 'openCamera') {
        screenProps.onLoginFinished = openCamera;
      }
      if (this.props.navigation.state.params.onLoginFinished === 'openAccount') {
        screenProps.onLoginFinished = () => {
          goBack();
          this.props.navigation.navigate('Account');
        };
      }
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <LoginNavigator
          screenProps={screenProps}
        />
      </View>
    );
  }
}

const LoginNavigator = StackNavigator({
  Welcome: { screen: LoginWelcome },
  Login: { screen: LoginForm },
  Signup: { screen: SignupForm }
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
    marginTop: 40,
    justifyContent: 'center'
  },
  pageEnd: {
    marginHorizontal: 50,
    marginBottom: 65,
    marginTop: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 15
  },
  headerText: {
    color: 'rgba(0, 0, 0, 0.75)',
    fontSize: 24,
    fontWeight: '900',
    paddingVertical: 5,
  },
  small: {
    marginTop: 10,
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 15
  },
  doneButton: {
    height: 60,
    borderTopWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.09)',
    flexDirection: 'row',
  },
  error: {
    marginTop: 20,
    fontSize: 15,
    alignSelf: 'center',
    color: 'red'
  }
};

export default LoginPage;
