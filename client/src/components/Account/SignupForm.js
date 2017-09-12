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
import {
  View, Text, TouchableWithoutFeedback, Keyboard,
  LayoutAnimation, TouchableOpacity, UIManager
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'firebase';
import LoginInput from './LoginInput';
import { loginStyles } from './LoginPage';
import { Spinner, Button } from '../common';
import { logInOrOut } from '../../actions';
import request from '../../helpers/axioshelper';
import { changeNameRequest } from '../../helpers/URL';

class SignupForm extends Component {
  state = { first: '', last: '', email: '', pass: '', error: '', loading: false, displayTop: true };

  componentWillMount() {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  onSignupButtonPress() {
    const { email, pass } = this.state;
    this.setState({ error: '', loading: true });
    if (this.props.loginState && this.props.loginState.isAnonymous) {
      const credential = firebase.auth.EmailAuthProvider.credential(email, pass);
      this.props.loginState.linkWithCredential(credential)
      .then(this.onCreateUserSuccess.bind(this))
      .catch(this.onCreateUserFail.bind(this));
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, pass)
      .then(this.onCreateUserSuccess.bind(this))
      .catch(this.onCreateUserFail.bind(this));
    }
  }

  onCreateUserSuccess(user) {
    const displayName = `${this.state.first} ${this.state.last}`;
    user.updateProfile({ displayName });
    request.patch(changeNameRequest(encodeURIComponent(displayName), user.uid))
      .catch(e => request.showErrorAlert(e));
    this.setState({ first: '', last: '', email: '', pass: '', loading: false });
    if (this.props.screenProps.onLoginFinished) {
      this.props.screenProps.onLoginFinished();
    }
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
    this.setState({ error: message, loading: false, editing: false });
  }

  shouldBlur() {
    const { first, last, email, pass } = this.state;
    return (first.length > 0 && last.length > 0 && email.length > 0 && pass.length > 0);
  }

  changeEditingState(editing) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ editing });
  }

  pressBackButton() {
    if (this.props.screenProps.anonymousAccount) {
      this.props.screenProps.onSkip();
    } else {
      this.props.navigation.goBack();
    }
  }

  renderSkip() {
    if (this.props.screenProps.anonymousAccount) return null;
    return (
      <Button
        style={{ marginVertical: 8 }}
        onPress={() => this.props.screenProps.onSkip()}
        colors={{ text: '#ff7f00', fill: '#fff', border: '#ff7f00' }}
        text={'Sign Up Later'}
        round
      />
    );
  }

  renderFacebookAndSkip() {
    if (this.state.editing) return null;
    return (
      <View>
        <Button
          style={{ marginVertical: 8 }}
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
        {this.renderSkip()}
        <View style={styles.emailHeaderStyle}>
          <View style={styles.emailBarStyle} />
          <Text style={styles.emailTextStyle}>or sign up with email</Text>
          <View style={styles.emailBarStyle} />
        </View>
      </View>
    );
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="large" />;
    }
    if (this.state.first.length > 0 && this.state.last.length > 0
        && this.state.email.length > 0 && this.state.pass.length > 0) {
      return (
        <Button
          onPress={this.onSignupButtonPress.bind(this)}
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
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          this.changeEditingState(false);
        }}
      >
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
              <Text style={loginStyles.headerText}>Sign up</Text>
            </View>

            {this.renderFacebookAndSkip()}
            <View style={{ backgroundColor: 'white', zIndex: 2 }}>
              <LoginInput
                label='First Name'
                autoCapitalize='words'
                returnKeyType='next'
                blurOnSubmit={false}
                onFocus={() => this.changeEditingState(true)}
                value={this.state.first}
                onChangeText={first => this.setState({ first })}
                onSubmitEditing={() => this.lastNameInput.focus()}
              />
              <LoginInput
                ref={lastNameInput => { this.lastNameInput = lastNameInput; }}
                label='Last Name'
                autoCapitalize='words'
                returnKeyType='next'
                blurOnSubmit={false}
                onFocus={() => this.changeEditingState(true)}
                value={this.state.last}
                onChangeText={last => this.setState({ last })}
                onSubmitEditing={() => this.emailInput.focus()}
              />
              <LoginInput
                ref={emailInput => { this.emailInput = emailInput; }}
                label='Email'
                keyboardType='email-address'
                returnKeyType='next'
                blurOnSubmit={false}
                onFocus={() => this.changeEditingState(true)}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
                onSubmitEditing={() => this.passwordInput.focus()}
              />
              <LoginInput
                ref={passwordInput => { this.passwordInput = passwordInput; }}
                label='Password'
                returnKeyType='go'
                value={this.state.pass}
                onChangeText={pass => this.setState({ pass })}
                blurOnSubmit={this.shouldBlur()}
                onFocus={() => this.changeEditingState(true)}
                onSubmitEditing={() => {
                  if (this.state.email.length > 0 && this.state.pass.length > 0) {
                    this.onSignupButtonPress();
                    this.changeEditingState(false);
                  } else {
                    this.setState({ error: 'Please fill in all fields before submitting.' });
                  }
                }}
                secure
              />
              <Text style={loginStyles.error}>{this.state.error}</Text>
            </View>
          </View>

          <View>
            <View style={loginStyles.pageEnd}>
              <Text style={{ marginTop: 10 }}>
                <Text style={loginStyles.small}>By signing up, I agree to Fota's </Text>
                <Text
                  style={loginStyles.link}
                  onPress={() => this.props.navigation.navigate('TOS')}
                >
                  Terms of Service
                </Text>
                <Text style={loginStyles.small}> and </Text>
                <Text
                  style={loginStyles.link}
                  onPress={() => this.props.navigation.navigate('PP')}
                >
                  Privacy Policy
                </Text>
                <Text style={loginStyles.small}>.</Text>
              </Text>
            </View>
            <View style={loginStyles.doneButton}>
              {this.renderButton()}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = {
  emailHeaderStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25
  },
  emailTextStyle: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.5)',
    marginHorizontal: 15
  },
  emailBarStyle: {
    height: 1,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
};

function mapStateToProps({ loginState }) {
  return { loginState };
}

export default connect(mapStateToProps, { logInOrOut })(SignupForm);
