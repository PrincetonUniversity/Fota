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
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import firebase from 'firebase';
import LoginWelcome from './LoginWelcome';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import PasswordResetForm from './PasswordResetForm';
import { TermsOfService, PrivacyPolicy } from '../Settings/SettingsIndex';

const { FBLoginManager } = require('react-native-facebook-login');

class LoginPage extends Component {
  static navigationOptions = {
    gesturesEnabled: false
  };

  logInWithFacebook() {
    console.log(FBLoginManager);
    FBLoginManager.loginWithPermissions(['email'], (error, data) => {
      console.log(data);
      if (!error) {
        const credential = firebase.auth.FacebookAuthProvider.credential(data.credentials.token);
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(() => console.log('account made'))
          .catch((error2) => console.log('Account not made'));
      } else {
        console.log(error, data);
      }
    });
  }

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
          this.props.screenProps.changeFocusedTab(1);
          this.props.navigation.navigate('Account');
        };
      }
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <LoginNavigator
          screenProps={{
            logInWithFacebook: () => this.logInWithFacebook(),
            ...screenProps
          }}
        />
      </View>
    );
  }
}

const LoginNavigator = StackNavigator({
  Welcome: { screen: LoginWelcome },
  Login: { screen: LoginForm },
  Signup: { screen: SignupForm },
  Forgot: { screen: PasswordResetForm },
  TOS: { screen: TermsOfService },
  PP: { screen: PrivacyPolicy }
},
{
  headerMode: 'none',
  cardStyle: {
    backgroundColor: '#fff'
  }
});

export const loginStyles = {
  pageStart: {
    marginHorizontal: 40,
    marginTop: 30,
    justifyContent: 'center'
  },
  pageEnd: {
    marginHorizontal: 40,
    marginBottom: 30,
    marginTop: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 15
  },
  headerText: {
    color: 'rgba(0, 0, 0, 0.75)',
    fontSize: 20,
    fontWeight: '900',
    paddingVertical: 5,
  },
  small: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 13
  },
  link: {
    color: '#2494ff',
    fontSize: 13
  },
  doneButton: {
    height: 50,
    borderTopWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.09)',
    //flexDirection: 'row',
    justifyContent: 'center'
  },
  error: {
    marginTop: 20,
    fontSize: 15,
    alignSelf: 'center',
    color: 'red'
  }
};

export default LoginPage;
