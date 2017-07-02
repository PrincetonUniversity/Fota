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
import { Text, View } from 'react-native';
import firebase from 'firebase';
import request from '../../helpers/axioshelper';
import { CardSection, Button, Input, Spinner } from '../common';

class LoginForm extends Component {
  state = { email: '', pass: '', error: '', loading: false };

  onLoginButtonPress() {
    const { email, pass } = this.state;

    this.setState({ error: '', loading: true });

    firebase.auth().signInWithEmailAndPassword(email, pass)
      .then(this.onLoginSuccess.bind(this))
      .catch(this.onLoginFail.bind(this));
  }

  onSignupButtonPress() {
    const { email, pass } = this.state;

    this.setState({ error: '', loading: true });

    firebase.auth().createUserWithEmailAndPassword(email, pass)
      .then(this.onCreateUserSuccess.bind(this))
      .catch(this.onCreateUserFail.bind(this));
  }

  onLoginSuccess() {
    this.setState({ email: '', pass: '', loading: false });
    this.props.onLoginFinished();
  }

  onLoginFail(error) {
    let message = 'Authentication error.';
    if (error.code === 'auth/invalid-email') {
      message = 'Invalid email.';
    } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      message = 'Incorrect email or password.';
    }
    this.setState({ error: message, loading: false });
  }

  onCreateUserSuccess(user) {
    this.setState({ email: '', pass: '', loading: false });
    request.post('https://fotafood.herokuapp.com/api/user', { id: user.uid })
      .then(this.props.onLoginFinished())
      .catch(e => request.showErrorAlert(e));
  }

  onCreateUserFail(error) {
    let message = 'Authentication error.';
    if (error.code === 'auth/email-already-in-use') {
      message = 'Email is already in use.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Invalid email.';
    } else if (error.code === 'auth/weak-password') {
      message = 'Password is too weak.';
    }
    this.setState({ error: message, loading: false });
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
        <Button onPress={this.onLoginButtonPress.bind(this)}>
          Log In
        </Button>
        <Button onPress={this.onSignupButtonPress.bind(this)}>
          Sign Up
        </Button>
      </View>
    );
  }

  render() {
    return (
      <View>
        <CardSection>
          <Input
            placeholder='user@example.com'
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          >
            <Text style={styles.labelStyle}>Email</Text>
          </Input>
        </CardSection>
        <CardSection>
          <Input
            placeholder='password'
            value={this.state.pass}
            onChangeText={pass => this.setState({ pass })}
            secure
          >
            <Text style={styles.labelStyle}>Password</Text>
          </Input>
        </CardSection>

        <Text style={styles.errorTextStyle}>
          {this.state.error}
        </Text>

        {this.renderButton()}
      </View>
    );
  }
}

const styles = {
  labelStyle: {
    flex: 0.35,
    fontFamily: 'Avenir'
  },
  errorTextStyle: {
    fontSize: 16,
    fontFamily: 'Avenir',
    alignSelf: 'center',
    color: 'red'
  }
};

export default LoginForm;
