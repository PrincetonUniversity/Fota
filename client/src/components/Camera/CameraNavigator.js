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
import CameraCommentsPage from './CameraCommentsPage';
import CameraLoginForm from './CameraLoginForm';

class CameraNavigator extends Component {
  static navigationOptions = {
    tabBarVisible: false
  };

  render() {
    if (this.props.loginState) {
      return (
        <CameraLoginForm navigation={this.props.navigation} />
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <CameraNav screenProps={{ rootNav: this.props.navigation, key: this.props.navigation.state.key }} />
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
  Comments: {
    screen: CameraCommentsPage
  },
},
{
  headerMode: 'none',
  cardStyle: { backgroundColor: 'white' }
});

function mapStateToProps({ loginState }) {
  return { loginState };
}

export default connect(mapStateToProps)(CameraNavigator);
