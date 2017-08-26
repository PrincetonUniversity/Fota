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
import { View, Text } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { NavigationActions } from 'react-navigation';
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
    console.log(error);
    let message = 'Authentication error.';
    if (error.code === 'auth/invalid-email') {
      message = 'Invalid email.';
    } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      message = 'Incorrect email or password.';
    }
    this.setState({ error: message, loading: false });
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="large" />;
    }
    if (this.state.email.length > 0 && this.state.pass.length > 0) {
      return (
        <Button
          onPress={this.onLoginButtonPress.bind(this)}
          colors={{ text: '#0097ff', fill: '#fff', border: '#fff' }}
          text={'DONE'}
        />
      );
    }
    return (
      <Button
        onPress={() => {}}
        colors={{ text: '#aaa', fill: '#fff', border: '#fff' }}
        text={'DONE'}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={loginStyles.pageStart}>
          <View style={loginStyles.header}>
            <Ionicon.Button
              name='ios-arrow-back'
              backgroundColor='#fff'
              color='rgba(0, 0, 0, 0.75)'
              size={28}
              onPress={() => this.props.navigation.dispatch(NavigationActions.back())}
            />
            <Text style={loginStyles.headerText}>Log in</Text>
          </View>

          <Text style={styles.welcomeStyle}>Welcome back!</Text>

          <LoginInput
            label='Email'
            value={this.state.email}
            keyboardType='email-address'
            onChangeText={email => this.setState({ email })}
          />
          <LoginInput
            label='Password'
            value={this.state.pass}
            onChangeText={pass => this.setState({ pass })}
            secure
          />

          <Text style={loginStyles.small}>Forgot your password?</Text>
          <Text style={loginStyles.error}>{this.state.error}</Text>
        </View>

        <View style={loginStyles.doneButton}>
          {this.renderButton()}
        </View>
      </View>
    );
  }
}

const styles = {
  welcomeStyle: {
    color: 'rgba(0, 0, 0, 0.75)',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10
  }
};

export default LoginForm;
