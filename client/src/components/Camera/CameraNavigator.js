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
import { View, BackHandler } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import CameraPage from './CameraPage';
import CameraLocationPage from './CameraLocationPage';

class CameraNavigator extends Component {
  static navigationOptions = {
    gesturesEnabled: false
  };

  componentWillMount() {
    this.screenProps = {
      onCameraClose: () => this.props.navigation.goBack(),
    };
    if (this.props.navigation.state.params && this.props.navigation.state.params.resetOnClose) {
      this.screenProps.onCameraClose = () => this.props.navigation.dispatch({
        type: 'Navigation/RESET',
        index: 0,
        actions: [{ type: 'Navigation/NAVIGATE', routeName: 'Main' }]
      });
    }
    this.backhandler = BackHandler.addEventListener('hardwareBackPress', this.pressBack.bind(this));
  }

  componentWillUnmount() {
    this.backhandler.remove();
  }

  pressBack() {
    this.screenProps.onCameraClose();
    return true;
  }

  render() {
    if (!this.props.loginState || this.props.loginState.isAnonymous) {
      return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
    }
    return (
      <View style={{ flex: 1 }}>
        <CameraNav
          screenProps={this.screenProps}
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
