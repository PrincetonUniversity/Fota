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
import { View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'firebase';
import LoginInput from './LoginInput';
import { loginStyles } from './LoginPage';
import { Spinner, Button } from '../common';

class LoginForm extends Component {
  state = { email: '', pass: '', error: '', loading: false };

  onLoginButtonPress() {
    const { email, pass } = this.state;
    this.setState({ error: '', loading: true });
    firebase.auth().signInWithEmailAndPassword(email, pass)
      .then(this.onLoginSuccess.bind(this))
      .catch(this.onLoginFail.bind(this));
  }

  onLoginSuccess() {
    this.setState({ email: '', pass: '', loading: false });
    if (this.props.screenProps.onLoginFinished) {
      this.props.screenProps.onLoginFinished();
    }
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

  shouldBlur() {
    return (this.state.email.length > 0 && this.state.pass.length > 0);
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="large" />;
    }
    if (this.state.email.length > 0 && this.state.pass.length > 0) {
      return (
        <Button
          onPress={this.onLoginButtonPress.bind(this)}
          colors={{ text: '#2494ff', fill: '#fff', border: '#fff' }}
          text={'DONE'}
        />
      );
    }
    return (
      <Button
        onPress={() => this.setState({ error: 'Please fill in all fields before submitting.' })}
        colors={{ text: 'rgba(0,0,0,0.3)', fill: '#fff', border: '#fff' }}
        text={'DONE'}
      />
    );
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View style={loginStyles.pageStart}>
            <View style={loginStyles.header}>
              <Icon.Button
                name='chevron-left'
                backgroundColor='white'
                color='rgba(0, 0, 0, 0.75)'
                size={25}
                style={{ height: 25 }}
                onPress={() => this.props.navigation.goBack()}
              />
              <Text style={loginStyles.headerText}>Log in</Text>
            </View>

            <Button
              style={{ marginTop: 8, marginBottom: 20 }}
              onPress={() => this.props.screenProps.logInWithFacebook()}
              colors={{ text: '#fff', fill: '#2494ff', border: '#2494ff' }}
              text={'Continue with Facebook'}
              round
            >
              <Icon
                name='facebook'
                backgroundColor='transparent'
                color='white'
                style={{ paddingRight: 10 }}
                size={16}
              />
            </Button>

            <LoginInput
              label='Email'
              keyboardType='email-address'
              returnKeyType='next'
              blurOnSubmit={false}
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
              onSubmitEditing={() => this.passwordInput.focus()}
            />
            <LoginInput
              ref={passwordInput => { this.passwordInput = passwordInput; }}
              label='Password'
              returnKeyType='go'
              blurOnSubmit={this.shouldBlur()}
              value={this.state.pass}
              onChangeText={pass => this.setState({ pass })}
              onSubmitEditing={() => {
                if (this.state.email.length > 0 && this.state.pass.length > 0) {
                  this.onLoginButtonPress();
                } else {
                  this.setState({ error: 'Please fill in all fields before submitting.' });
                }
              }}
              secure
            />

            <Text style={{ marginTop: 10 }}>
                <Text style={loginStyles.small}>Forgot your </Text>
                <Text
                  style={loginStyles.link}
                  onPress={() => this.props.navigation.navigate('Forgot')}
                >
                  password
                </Text>
                <Text>?</Text>
              </Text>
            <Text style={loginStyles.error}>{this.state.error}</Text>
          </View>

          <View style={loginStyles.doneButton}>
            {this.renderButton()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default LoginForm;
