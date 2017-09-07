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
import { StackNavigator } from 'react-navigation';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import ProfilePage from './ProfilePage';
import SettingsPage from '../Settings/SettingsPage';
import { SettingsRadius, TermsOfService, PrivacyPolicy } from '../Settings/SettingsIndex';
import { tabWidth, tabHeight, horizontalPadding } from '../../Base';
import icoMoonConfig from '../../selection.json';

const Icon = createIconSetFromIcoMoon(icoMoonConfig);

class ProfileHelper extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    tabBarIcon: ({ focused }) => {
      const color = focused ? '#ff9700' : '#ccc';
      return (
        <TouchableOpacity
          style={{
            width: tabWidth + horizontalPadding * 2,
            height: tabHeight,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => {
            if (screenProps.user && !screenProps.user.isAnonymous) {
              if (screenProps.focusedTab !== 1) {
                screenProps.changeFocusedTab(1);
                navigation.navigate('Account');
                screenProps.reloadProfile();
              }
            } else {
              navigation.navigate('Login', { onLoginFinished: 'openAccount' });
            }
          }}
        >
          <Icon
            name={'profile'}
            color={color}
            size={28}
            style={{
              width: 38,
              textAlign: 'center',
            }}
          />
        </TouchableOpacity>
      );
    }
  });

  render() {
    if (!this.props.loginState || this.props.loginState.isAnonymous) {
      return <View />;
    }
    return (
      <ProfileNavigator
        screenProps={{ user: this.props.loginState }}
      />
    );
  }
}

const ProfileNavigator = StackNavigator({
  Profile: { screen: ProfilePage },
  Settings: { screen: SettingsPage },
  Radius: { screen: SettingsRadius },
  TOS: { screen: TermsOfService },
  PP: { screen: PrivacyPolicy }
},
{
  headerMode: 'none',
  cardStyle: {
    backgroundColor: '#fff'
  }
});

function mapStateToProps({ loginState, mainNavigator }) {
  return { loginState, mainNavigator };
}

export default connect(mapStateToProps)(ProfileHelper);
