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
import Permissions from 'react-native-permissions';
import { connect } from 'react-redux';
import CameraPage from './CameraPage';
import CameraLocationPage from './CameraLocationPage';
import { MissingPermission } from '../common';
import { setPermission } from '../../actions';


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
    Permissions.check('camera').then(response => {
      if (response === 'authorized') {
        this.props.setPermission({ camera: true });
      } else if (response === 'undetermined') {
        this.requestCameraPermission();
      } else {
        this.props.setPermission({ camera: false });
      }
    });
  }

  componentWillUnmount() {
    this.backhandler.remove();
  }

  pressBack() {
    this.screenProps.onCameraClose();
    return true;
  }

  requestCameraPermission() {
    Permissions.request('camera').then(response => {
      if (response === 'authorized') {
        this.props.setPermission({ camera: true });
      } else {
        this.props.setPermission({ camera: false });
      }
    });
  }

  render() {
    if (!this.props.loginState || this.props.loginState.isAnonymous) {
      return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
    }
    switch (this.props.permissions.camera) {
      case true:
        return (
          <View style={{ flex: 1 }}>
            <CameraNav
              screenProps={this.screenProps}
            />
          </View>
        );
      case false:
        return <MissingPermission type='camera' />;
      default:
        return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
    }
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

function mapStateToProps({ loginState, permissions }) {
  return { loginState, permissions };
}

export default connect(mapStateToProps, { setPermission })(CameraNavigator);
