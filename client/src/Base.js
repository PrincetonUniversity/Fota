/******************************************************************************
 * Called by: App
 *
 * Dependencies: redux, firebase, Photo/HomePage, Search/SearchPage,
 * common/BlankPage, Account/AccountPage, Settings/SettingsPage,
 * Camera/CameraNavigator, common/Footer, Navbar, actions/setCameraState,
 * actions/logInOrOut
 *
 * Description: Base page for Fota. Displays all content on screen, including
 * the navigation bar (Navbar), the currently loaded page (Photo/HomePage,
 * Search/SearchPage, Camera/CameraNavigator, Account/AccountPage,
 * Settings/SettingsPage). Initializes login state.
 *
 * Bugs/Todo: Footer margin not implemented with navbar
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { View, AsyncStorage, Alert, StatusBar, Dimensions } from 'react-native';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import firebase from 'firebase';
import LoginPage from './components/Account/LoginPage';
import HomePage from './components/Photo/HomePage';
import ProfileHelper from './components/Profile/ProfileHelper';
import CameraNavigator from './components/Camera/CameraNavigator';
import CameraHelper from './components/Camera/CameraHelper';
import { logInOrOut, browseFromPrinceton } from './actions';

export const pcoords = { lat: 40.3440, lng: -74.6514 };

export const tabWidth = (Dimensions.get('window').width / 4) + 9;
export const horizontalPadding = (Dimensions.get('window').width - 114) / 8;
export const tabHeight = 50;

class Base extends Component {
  constructor(props) {
    super(props);
    this.state = { loginFinished: false };
  }

  componentWillMount() {
    this.props.browseFromPrinceton(false);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.auth().currentUser.getToken(false).then((idToken) => {
          AsyncStorage.setItem('JWT', idToken);
          this.props.logInOrOut(user);
          this.setState({ loginFinished: true });
        })
        .catch(e => {
          console.log(e);
        });
      } else {
        AsyncStorage.setItem('JWT', null);        
        this.props.logInOrOut(user);
        this.setState({ loginFinished: true });
      }
    });
  }

  logInAnonymously() {
    this.setState({ loginFinished: false });
    firebase.auth().signInAnonymously().catch(() => {
      Alert.alert(
        'Error',
        'Oops! Something went wrong. Please restart the app and try again.',
        [{ text: 'OK' }]
      );
    });
  }

  render() {
    if (this.state.loginFinished) {
      if (this.props.loginState) {
        return (
          <View style={{ flex: 1 }}>
            <StatusBar hidden={false} />
            <FotaNavigator screenProps={{ user: this.props.loginState }} />
          </View>
        );
      }
      return (
        <View style={{ flex: 1 }}>
          <StatusBar hidden={false} />
          <LoginPage onSkip={this.logInAnonymously.bind(this)} />
        </View>
      );
    }
    return (
      <View />
    );
  }
}

const MainNavigator = TabNavigator({
  Home: {
    screen: HomePage
  },
  CameraOpener: {
    screen: CameraHelper
  },
  Account: {
    screen: ProfileHelper
  },
},
{
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  animationEnabled: false,
  lazy: true,
  initialRouteName: 'Home',
  tabBarOptions: {
    showLabel: false,
    showIcon: true,
    style: {
      paddingHorizontal: horizontalPadding,
      height: tabHeight,
      borderTopWidth: 0,
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: -5 },
      shadowRadius: 5
    },
  }
});

const FotaNavigator = StackNavigator({
  Main: {
    screen: MainNavigator
  },
  Camera: {
    screen: CameraNavigator
  },
  Login: {
    screen: LoginPage
  }
},
{
  mode: 'modal',
  headerMode: 'none',
});

function mapStateToProps({ loginState }) {
  return { loginState };
}

export default connect(mapStateToProps, { logInOrOut, browseFromPrinceton })(Base);
