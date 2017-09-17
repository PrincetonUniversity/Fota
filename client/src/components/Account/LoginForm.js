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
import { View, Text, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'firebase';
import LoginInput from './LoginInput';
import { loginStyles } from './LoginPage';
import { Spinner, Button } from '../common';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', pass: '', error: '', loading: false, fbLoading: false };
    this.deactivateButtons = false;
  }

  onLoginButtonPress() {
    if (this.deactivateButtons) return;
    this.deactivateButtons = true;
    //if (this.state.fbLoading || this.state.loading) return;
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

  pressBackButton() {
    if (this.deactivateButtons) return;
    if (this.props.screenProps.anonymousAccount) {
      this.props.screenProps.onSkip();
    } else {
      this.props.navigation.goBack();
    }
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
    const text = this.state.fbLoading ? 'Logging you in...' : 'Continue with Facebook';    
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View style={loginStyles.pageStart}>
            <View style={loginStyles.header}>
              <TouchableOpacity onPress={() => this.pressBackButton()}>
                <Icon
                  name='chevron-left'
                  color='rgba(0, 0, 0, 0.75)'
                  size={20}
                  style={{ height: 20, marginRight: 15 }}
                />
              </TouchableOpacity>
              <Text style={loginStyles.headerText}>Log in</Text>
            </View>

            <Button
              style={{ marginTop: 8, marginBottom: 20 }}
              onPress={() => {
                if (this.deactivateButtons) return;
                this.deactivateButtons = true;
                this.setState({ fbLoading: true });
                this.props.screenProps.logInWithFacebook();
              }}
              colors={{ text: '#fff', fill: '#2494ff', border: '#2494ff' }}
              text={text}
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
                <Text style={loginStyles.small}>?</Text>
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
