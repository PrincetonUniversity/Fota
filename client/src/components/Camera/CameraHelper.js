/******************************************************************************
 * Called by: Base
 * Dependencies: common/Header, ./UserPage, ./LoginForm, redux
 *
 * Description: Returns either the user page (./UserPage) or the login form
 * (./LoginForm) depending on whether the user is logged in or not.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import RequestSignup from '../Account/RequestSignup';
import { tabWidth, tabHeight } from '../../Base';

class CameraHelper extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    tabBarIcon: ({ focused }) => {
      const color = focused ? '#ff9700' : '#ccc';
      return (     
        <TouchableOpacity
          style={{
            width: tabWidth,
            height: tabHeight,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => {
            if (screenProps.user && !screenProps.user.isAnonymous) {
              navigation.navigate('Camera');
            } else if (screenProps.focusedTab !== 1) {
              screenProps.changeFocusedTab(1);
              navigation.navigate('CameraOpener');
              //navigation.navigate('Login', { onLoginFinished: 'openCamera' });
            }
          }}
        >
          <Icon
            name={'md-add'}
            color={color}
            size={30}
            style={{
              borderColor: color,
              borderRadius: 5,
              borderWidth: 2,
              width: 38,
              height: 38,
              padding: 4,
              textAlign: 'center',
            }}
          />
        </TouchableOpacity>
      );
    }
  });

  render() {
    if (!this.props.loginState || this.props.loginState.isAnonymous) {
      return (
        <RequestSignup
          navigation={this.props.navigation}
          onLoginFinished='openCamera'
          text={'Sign up to upload photos.'}
        />
      );
    }
    return <View style={{ flex: 1, backgroundColor: 'white' }} />;
  }
}

function mapStateToProps({ loginState, mainNavigator }) {
  return { loginState, mainNavigator };
}

export default connect(mapStateToProps)(CameraHelper);
