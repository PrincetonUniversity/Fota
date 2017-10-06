/******************************************************************************
 * Called by: Base
 * Dependencies: common/Header, ./UserPage, ./LoginForm, redux
 *
 * Description: Returns either the user page (./UserPage) or the login form
 * (./LoginForm) depending on whether the user is logged in or not.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { StackNavigator } from 'react-navigation';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import ProfilePage from './ProfilePage';
import RewardsPage from './RewardsPage';
import RequestSignup from '../Account/RequestSignup';
import SettingsPage from '../Settings/SettingsPage';
import { SettingsRadius, TermsOfService, PrivacyPolicy } from '../Settings/SettingsIndex';
import { tabWidth, tabHeight, horizontalPadding } from '../../Base';
import icoMoonConfig from '../../selection.json';

const Icon = createIconSetFromIcoMoon(icoMoonConfig);

class ProfileHelper extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    tabBarIcon: ({ focused }) => {
      const color = focused ? '#ff7f00' : '#ccc';
      return (
        <TouchableOpacity
          style={{
            width: tabWidth + horizontalPadding * 2,
            height: tabHeight,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => {
            if (screenProps.focusedTab !== 2) {
              screenProps.changeFocusedTab(2);
              navigation.navigate('Account');
              if (screenProps.user && !screenProps.user.isAnonymous && screenProps.reloadProfile) {
                screenProps.reloadProfile();
              }
            }
            //if (screenProps.user && !screenProps.user.isAnonymous) {
            //  if (screenProps.focusedTab !== 1) {
            //    screenProps.changeFocusedTab(1);
            //    navigation.navigate('Account');
            //    if (screenProps.reloadProfile) screenProps.reloadProfile();
            //  }
            //}
            //else {
            //  navigation.navigate('Login', { onLoginFinished: 'openAccount' });
            //}
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
      return (
        <RequestSignup
          navigation={this.props.navigation}
          onLoginFinished='openAccount'
          text={'You don\'t have an account yet!'}
        />
      );
    }
    return (
      <ProfileNavigator
        screenProps={{
          user: this.props.loginState,
          changeFocusedTab: this.props.screenProps.changeFocusedTab
        }}
      />
    );
  }
}

const ProfileNavigator = StackNavigator({
  Profile: { screen: ProfilePage },
  Rewards: { screen: RewardsPage },
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
