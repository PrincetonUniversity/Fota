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
import { tabWidth, tabHeight } from '../../Base';

class CameraHelper extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    tabBarIcon: () => {
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
            } else {
              navigation.navigate('Login', { onLoginFinished: 'openCamera' });
            }
          }}
        >
          <Icon
            name={'md-add'}
            color='#ccc'
            size={30}
            style={{
              borderColor: '#ccc',
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
    return <View />;
  }
}

function mapStateToProps({ loginState, mainNavigator }) {
  return { loginState, mainNavigator };
}

export default connect(mapStateToProps)(CameraHelper);
