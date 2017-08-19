/******************************************************************************
 * Called by: Base
 * Dependencies: redux, ./CameraPage, ./CameraLocationPage, ./CameraCommentsPage,
 * ./CameraLoginForm
 *
 * Description: The main logic for switching between the different camera pages.
 * Currently implemented with a Navigator component.
 *
 * Bugs: CameraLoginForm. May need to take out the modal implementation
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import CameraPage from './CameraPage';
import CameraLocationPage from './CameraLocationPage';
import LoginPage from '../Account/LoginPage';
import { setCameraState } from '../../actions';

class CameraNavigator extends Component {
  render() {
    if (this.props.loginState && !this.props.loginState.isAnonymous) {
      return <LoginPage onSkip={() => this.props.setCameraState(false)} />;
    }
    return (
      <View style={{ flex: 1 }}>
        <CameraNav />
      </View>
    );
  }
}

const CameraNav = StackNavigator({
  Camera: {
    screen: CameraPage
  },
  Location: {
    screen: CameraLocationPage
  },
},
{
  headerMode: 'none',
  cardStyle: { backgroundColor: 'white' }
});

function mapStateToProps({ loginState }) {
  return { loginState };
}

export default connect(mapStateToProps, { setCameraState })(CameraNavigator);
