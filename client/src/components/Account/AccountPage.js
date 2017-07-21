/******************************************************************************
 * Called by: Base
 * Dependencies: common/Header, ./UserPage, ./LoginForm, redux
 *
 * Description: Returns either the user page (./UserPage) or the login form
 * (./LoginForm) depending on whether the user is logged in or not.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { Text, View, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { connect } from 'react-redux';
import { Header } from '../common';
import UserPage from './UserPage';
import LoginForm from './LoginForm';

const homeUnactivated = require('../../img/fota_home_unactivated.png');

class AccountPage extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={homeUnactivated}
        style={{ width: 26, height: 26, tintColor }}
      />
    ),
  };

  render() {
    if (this.props.loginState) {
      return <UserPage user={this.props.loginState} />;
    }
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <Header><Text style={styles.headerTextStyle}>Log In</Text></Header>
          <LoginForm />
        </View>
      </TouchableWithoutFeedback>
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
  }
};

function mapStateToProps({ loginState }) {
  return { loginState };
}

export default connect(mapStateToProps)(AccountPage);
