import React, { Component } from 'react';
import { Text, View } from 'react-native';
import firebase from 'firebase';
import { Header, Button } from './common';
import LoginForm from './LoginForm';

class AccountPage extends Component {
  render() {
    if (this.props.user) {
      return (
        <View>
          <Header><Text>{this.props.user}</Text></Header>
          <Button onPress={() => firebase.auth().signOut()}>Log out</Button>
        </View>
      );
    }
    return (
      <View>
        <Header><Text style={{ fontSize: 20, color: '#000' }}>Log In</Text></Header>
        <LoginForm />
      </View>
    );
  }
}

export default AccountPage;
