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
import { View, AsyncStorage, Alert, Dimensions } from 'react-native';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import firebase from 'firebase';
import LoginPage from './components/Account/LoginPage';
import HomePage from './components/Photo/HomePage';
//import SearchPage from './components/Search/SearchPage';
import AccountPage from './components/Profile/AccountPage';
//import SettingsPage from './components/Settings/SettingsPage';
//import Navbar from './components/Navbar';
import CameraNavigator from './components/Camera/CameraNavigator';
import CameraHelper from './components/Camera/CameraHelper';
import { logInOrOut } from './actions';

export const tabWidth = (Dimensions.get('window').width / 4) + 9;
export const horizontalPadding = (Dimensions.get('window').width - 114) / 8;
export const tabHeight = 50;

class Base extends Component {
  constructor(props) {
    super(props);
    this.state = { loginFinished: false };
  }

  // componentWillMount() {
  //   firebase.auth().onAuthStateChanged((user) => {
  //     this.props.logInOrOut(user);
  //     this.setState({ loginFinished: true });
  //   });
  // }
  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.auth().currentUser.getToken(true).then((idToken) => {
          AsyncStorage.setItem('JWT', idToken);
          this.props.logInOrOut(user);
          this.setState({ loginFinished: true });
        })
        .catch(e => {
          console.log(e);
        });
      } else {
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
            <FotaNavigator screenProps={{ user: this.props.loginState }} />
          </View>
        );
      }
      return (
        <LoginPage onSkip={this.logInAnonymously.bind(this)} />
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
    screen: AccountPage
  },
},
{
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  animationEnabled: false,
  //lazy: true,
  initialRouteName: 'Home',
  tabBarOptions: {
    showLabel: false,
    showIcon: true,
    style: {
      //borderWidth: 5,
      paddingHorizontal: horizontalPadding,
      //backgroundColor: 'white'
    },
    tabStyle: {
      borderWidth: 5
    }
  },
  style: {
    height: tabHeight
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

export default connect(mapStateToProps, { logInOrOut })(Base);
