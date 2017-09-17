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
import { View, Text, AsyncStorage, Alert, StatusBar, Dimensions, BackHandler } from 'react-native';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';
import Permissions from 'react-native-permissions';
import { connect } from 'react-redux';
import firebase from 'firebase';
import LoginPage from './components/Account/LoginPage';
import HomePage from './components/Photo/HomePage';
import ProfileHelper from './components/Profile/ProfileHelper';
import CameraNavigator from './components/Camera/CameraNavigator';
import CameraHelper from './components/Camera/CameraHelper';
import { logInOrOut, browseFromPrinceton, saveBaseNavHome, setPermission } from './actions';

export const pcoords = { lat: 40.3440, lng: -74.6514 };

export const tabWidth = (Dimensions.get('window').width / 4) + 9;
export const horizontalPadding = (Dimensions.get('window').width - 114) / 8;
export const tabHeight = 50;

class Base extends Component {
  constructor(props) {
    super(props);
    this.state = { loginFinished: false, focusedTab: 0 };
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
        AsyncStorage.setItem('JWT', '');
        this.props.logInOrOut(user);
        this.setState({ loginFinished: true });
      }
    });
    BackHandler.addEventListener('hardwareBackPress', () => {
      const nav = this.navigator.state.nav;
      if (nav.routes.length === 1) {
        if (nav.routes[0].index === 0) return false;
        this.setState({ focusedTab: 0 });
        this.navigator.dispatch({ type: 'Navigation/NAVIGATE', routeName: 'Home' });
        return true;
      }
      this.navigator.dispatch({ type: 'Navigation/BACK' });
      return true;
    });
    Permissions.check('location').then(response => {
      if (response === 'authorized') {
        this.props.setPermission({ location: true });
      } else if (response === 'undetermined') {
        this.requestLocationPermission();
      } else {
        this.setState({ location: false });
      }
    });
  }

  componentDidMount() {
    this.props.saveBaseNavHome(() => {
      this.navigator.dispatch({ type: 'Navigation/NAVIGATE', routeName: 'Home' });
      this.setState({ focusedTab: 0 });
    });
  }

  requestLocationPermission() {
    Permissions.request('location').then(response => {
      if (response === 'authorized') {
        this.setState({ location: true });
      } else {
        this.setState({ location: false });
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
        switch (this.props.permissions.location) {
          case true:
            return (
              <View style={{ flex: 1 }}>
                <StatusBar hidden={false} />
                <FotaNavigator
                  ref={nav => { this.navigator = nav; }}
                  screenProps={{
                    user: this.props.loginState,
                    reloadProfile: this.props.reloadProfile,
                    focusedTab: this.state.focusedTab,
                    changeFocusedTab: tab => this.setState({ focusedTab: tab }),
                    scrollToTop: () => {
                      if (this.props.lists.hot) this.props.lists.hot.scrollToOffset({ offset: 0, animated: true });
                      if (this.props.lists.new) this.props.lists.new.scrollToOffset({ offset: 0, animated: true });
                      if (this.props.lists.search) this.props.lists.search.scrollToOffset({ offset: 0, animated: true });
                    }
                  }}
                />
              </View>
            );
          case false:
            return (
              <View style={{ flex: 1 }}>
                <StatusBar hidden={false} />
                <Text>Fota needs your location!</Text>
              </View>
            );
          default:
            return null;
        }
      }
      return (
        <View style={{ flex: 1 }}>
          <StatusBar hidden={false} />
          <LoginPage onSkip={this.logInAnonymously.bind(this)} />
        </View>
      );
    }
    return null;
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
  backBehavior: 'none',
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

function mapStateToProps({ loginState, reloadProfile, lists, permissions }) {
  return { loginState, reloadProfile, lists, permissions };
}

const dispatch = { logInOrOut, browseFromPrinceton, saveBaseNavHome, setPermission };

export default connect(mapStateToProps, dispatch)(Base);
