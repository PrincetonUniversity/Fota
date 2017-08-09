/******************************************************************************
 * Called by: Base
 * Dependencies: common/Header, ./UserPage, ./LoginForm, redux
 *
 * Description: Returns either the user page (./UserPage) or the login form
 * (./LoginForm) depending on whether the user is logged in or not.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';
import UserPage from './UserPage';
import LoginPage from './LoginPage';

const homeUnactivated = require('../../img/fota_home_unactivated.png');

class AccountPage extends Component {
  static navigationOptions = {
    tabBarVisible: false,
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
    return <LoginPage />;
  }
}

function mapStateToProps({ loginState }) {
  return { loginState };
}

export default connect(mapStateToProps)(AccountPage);
