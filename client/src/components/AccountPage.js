import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Header, Button, CardSection } from './common';
import LoginForm from './LoginForm';

class AccountPage extends Component {
  render() {
    if (this.props.loginState) {
      //console.log(this.props.loginState);
      return (
        <View>
          <Header><Text style={styles.headerTextStyle}>{this.props.loginState.email}</Text></Header>
          <CardSection>
            <Button onPress={() => firebase.auth().signOut()}>Log out</Button>
          </CardSection>
        </View>
      );
    }
    return (
      <View>
        <Header><Text style={styles.headerTextStyle}>Log In</Text></Header>
        <LoginForm />
      </View>
    );
  }
}

const styles = {
  headerTextStyle: {
    fontSize: 20,
    color: '#000'
  }
};

function mapStateToProps({ loginState }) {
  return { loginState };
}

export default connect(mapStateToProps)(AccountPage);
