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

class CameraNavigator extends Component {
  static navigationOptions = {
    gesturesEnabled: false
  };
  
  render() {
    if (!this.props.loginState || this.props.loginState.isAnonymous) {
      return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
    }
    const screenProps = { goBack: () => this.props.navigation.goBack() };
    if (this.props.navigation.state.params && this.props.navigation.state.params.goBack) {
      screenProps.goBack = this.props.navigation.state.params.goBack;
    }
    return (
      <View style={{ flex: 1 }}>
        <CameraNav 
          screenProps={screenProps} 
        />
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

export default connect(mapStateToProps)(CameraNavigator);
