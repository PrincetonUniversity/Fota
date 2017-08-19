/******************************************************************************
 * Called by: Base
 * Dependencies: common/Header, ./UserPage, ./LoginForm, redux
 *
 * Description: Returns either the user page (./UserPage) or the login form
 * (./LoginForm) depending on whether the user is logged in or not.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserPage from './UserPage';
import LoginPage from '../Account/LoginPage';

class ProfilePage extends Component {
  render() {
    if (!this.props.loginState || this.props.loginState.isAnonymous) {
      return <LoginPage onSkip={() => this.props.navigation.navigate('Home')} />;
    }
    return <UserPage user={this.props.loginState} testuser={testuser} />;
  }
}

const testuser = {
  bookmarked: [],
  upvoted: [],
  uploaded: [],
  comments: []
};

function mapStateToProps({ loginState }) {
  return { loginState };
}

export default connect(mapStateToProps)(ProfilePage);
