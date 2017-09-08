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
import { View, Text, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'firebase';
import LoginInput from './LoginInput';
import { loginStyles } from './LoginPage';
import { Spinner, Button } from '../common';

class PasswordResetForm extends Component {
  state = { email: '', error: '', loading: false, successful: false };

  onResetButtonPress() {
    this.setState({ error: '', loading: true });
    firebase.auth().sendPasswordResetEmail(this.state.email)
      .then(this.onResetSuccess.bind(this))
      .catch(this.onResetFail.bind(this));
  }

  onResetSuccess() {
    this.setState({ email: '', loading: false, successful: true });
    Alert.alert(
      '',
      'An email has been sent to your account.',
      [{ text: 'OK' }]
    );
  }

  onResetFail(error) {
    let message = 'Error sending email.';
    if (error.code === 'auth/invalid-email') {
      message = 'Invalid email.';
    } else if (error.code === 'auth/user-not-found') {
      message = 'That email was not found.';
    }
    this.setState({ error: message, loading: false });
  }

  shouldBlur() {
    return (this.state.email.length > 0);
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="large" />;
    }
    if (this.state.email.length > 0) {
      return (
        <Button
          onPress={this.onResetButtonPress.bind(this)}
          colors={{ text: '#2494ff', fill: '#fff', border: '#fff' }}
          text={'DONE'}
        />
      );
    }
    return (
      <Button
        onPress={() => this.setState({ error: 'Please enter an email address.' })}
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
              <Text style={loginStyles.headerText}>Forgot your password?</Text>
            </View>

            <View style={{ marginTop: 8, marginBottom: 20 }}>
              <Text style={loginStyles.small}>
                Enter your email address below and we'll send you an email with instructions on how to reset your password.
              </Text>
            </View>

            <LoginInput
              label='Email'
              keyboardType='email-address'
              returnKeyType='go'
              blurOnSubmit={this.shouldBlur()}
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
              onSubmitEditing={() => {
                if (this.state.email.length > 0) {
                  this.onResetButtonPress();
                } else {
                  this.setState({ error: 'Please enter an email address.' });
                }
              }}
            />
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

export default PasswordResetForm;
