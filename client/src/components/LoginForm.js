import React, { Component } from 'react';
import { Text, View } from 'react-native';
import firebase from 'firebase';
import axios from 'axios';
import { Header, CardSection, Button, Input, Spinner } from './common';

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
    axios.post('https://fotafood.herokuapp.com/api/user', { id: user.uid });
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
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
        <Header><Text style={styles.headerTextStyle}>Log In</Text></Header>
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
  headerTextStyle: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Avenir',
    color: '#000'
  },
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
