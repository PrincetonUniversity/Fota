/******************************************************************************
 * Called by: Base
 * Dependencies: redux, ./CameraPage, ./CameraLocationPage, ./CameraCommentsPage,
 * ./CameraLoginForm
 *
 * Description: The main logic for switching between the different camera pages.
 * Currently implemented with a Navigator component.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { View, Navigator } from 'react-native';
import { connect } from 'react-redux';
import CameraPage from './CameraPage';
import CameraLocationPage from './CameraLocationPage';
import CameraCommentsPage from './CameraCommentsPage';
import CameraLoginForm from './CameraLoginForm';

class CameraNavigator extends Component {
  renderScene(route, navigator) {
    switch (route.id) {
      case 0:
        return <CameraPage navigator={navigator} />;
      case 1:
        return <CameraLocationPage navigator={navigator} />;
      case 2:
        return <CameraCommentsPage navigator={navigator} />;
      default:
        return <CameraLoginForm navigator={navigator} />;
    }
  }

  render() {
    const user = (this.props.loginState) ? 0 : -1;
    return (
      <View style={{ flex: 1 }}>
        <Navigator
          style={{ flex: 1, backgroundColor: '#fff' }}
          initialRoute={{ id: user }}
          renderScene={this.renderScene.bind(this)}
        />
      </View>
    );
  }
}

function mapStateToProps({ loginState }) {
  return { loginState };
}

export default connect(mapStateToProps)(CameraNavigator);
