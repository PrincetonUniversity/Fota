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
import { View, Alert } from 'react-native';
import { StackNavigator } from 'react-navigation';
import firebase from 'firebase';
import LoginWelcome from './LoginWelcome';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import PasswordResetForm from './PasswordResetForm';
import { TermsOfService, PrivacyPolicy } from '../Settings/SettingsIndex';
import request from '../../helpers/axioshelper';
import { changeNameRequest } from '../../helpers/URL';

const { FBLoginManager } = require('react-native-facebook-login');

class LoginPage extends Component {
  static navigationOptions = {
    gesturesEnabled: false
  };

  componentWillMount() {
    this.screenProps = {
      onSkip: this.props.onSkip,
      onLoginFinished: this.props.onLoginFinished
    };
    if (this.props.navigation) {
      const goBack = () => this.props.navigation.goBack();
      const openCamera = () => this.props.navigation.navigate('Camera', { resetOnClose: true });
      this.screenProps = { onSkip: goBack, onLoginFinished: goBack };
      if (this.props.navigation.state.params.onLoginFinished === 'openCamera') {
        this.screenProps.onLoginFinished = openCamera;
      }
      if (this.props.navigation.state.params.onLoginFinished === 'openAccount') {
        this.screenProps.onLoginFinished = goBack;
      }
    }
  }

  logInWithFacebook(onFail) {
    FBLoginManager.loginWithPermissions(['email'], (error, data) => {
      if (!error) {
        const credential = firebase.auth.FacebookAuthProvider.credential(data.credentials.token);
        firebase.auth().signInWithCredential(credential)
        .then(user => {
          request.patch(changeNameRequest(encodeURIComponent(user.displayName), user.uid))
            .catch(() => request.showErrorAlert({
              etype: -1,
              title: 'Setting Name Error',
              text: 'You should never see this error. If you do, please let us know immediately.' 
            }));
          if (this.screenProps.onLoginFinished) this.screenProps.onLoginFinished();          
        }).catch(e => { this.facebookErrorAlert(e, onFail); });
      } else {
        this.facebookErrorAlert(error, onFail);
      }
    });
  }

  facebookErrorAlert(error, onFail) {
    console.log(error);
    Alert.alert(
      'Login Error',
      'We had some trouble logging you in with Facebook.',
      [{ text: 'OK', onPress: () => onFail() }]
    );
  }

  render() {
    const goto = this.props.navigation ? this.props.navigation.state.params.goto : null;
    if (goto === 'Signup') {
      return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <SignupNavigator
            screenProps={{
              logInWithFacebook: (onFail) => this.logInWithFacebook(onFail),
              anonymousAccount: true,
              ...this.screenProps
            }}
          />
        </View>
      ); 
    }
    if (goto === 'Login') {
      return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <LoginNavigator
            screenProps={{
              logInWithFacebook: (onFail) => this.logInWithFacebook(onFail),
              anonymousAccount: true,
              ...this.screenProps
            }}
          />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <FullNavigator
          screenProps={{
            logInWithFacebook: (onFail) => this.logInWithFacebook(onFail),
            anonymousAccount: false,
            ...this.screenProps
          }}
        />
      </View>
    );
  }
}

const FullNavigator = StackNavigator({
  Welcome: { screen: LoginWelcome },
  Login: { screen: LoginForm },
  Signup: { screen: SignupForm },
  Forgot: { screen: PasswordResetForm },
  TOS: { screen: TermsOfService },
  PP: { screen: PrivacyPolicy }
},
{
  headerMode: 'none',
  mode: 'modal',
  cardStyle: {
    backgroundColor: '#fff'
  }
});

const LoginNavigator = StackNavigator({
  Login: { screen: LoginForm },
  Forgot: { screen: PasswordResetForm },
},
{
  headerMode: 'none',
  mode: 'modal',
  cardStyle: {
    backgroundColor: '#fff'
  }
});

const SignupNavigator = StackNavigator({
  Signup: { screen: SignupForm },
  TOS: { screen: TermsOfService },
  PP: { screen: PrivacyPolicy }
},
{
  headerMode: 'none',
  mode: 'modal',
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
