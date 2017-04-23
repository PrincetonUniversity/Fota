import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserPage from './UserPage';
import LoginForm from './LoginForm';

class AccountPage extends Component {
  render() {
    if (this.props.loginState) {
      return <UserPage user={this.props.loginState} />;
    }
    return <LoginForm />;
  }
}

function mapStateToProps({ loginState }) {
  return { loginState };
}

export default connect(mapStateToProps)(AccountPage);
