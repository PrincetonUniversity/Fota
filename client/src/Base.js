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
import { View, Modal, AsyncStorage, Alert, Text } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import firebase from 'firebase';
import LoginPage from './components/Account/LoginPage';
import PhotoList from './components/Photo/PhotoList';
//import SearchPage from './components/Search/SearchPage';
import ProfilePage from './components/Profile/ProfilePage';
//import SettingsPage from './components/Settings/SettingsPage';
import Navbar from './components/Navbar';
import CameraNavigator from './components/Camera/CameraNavigator';
import { setCameraState, logInOrOut } from './actions';

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
      console.log('im here');
      Alert.alert(
        'Error',
        'Oops! Something went wrong. Please restart the app and try again.',
        [{ text: 'OK' }]
      );
    });
  }

  render() {
    console.log(this.props.loginState);
    if (this.state.loginFinished) {
      if (this.props.loginState) {
        return (
          <View style={{ flex: 1 }}>
            <Modal
              animationType={'slide'}
              visible={this.props.cameraVisible}
              style={{ flex: 1 }}
              onRequestClose={() => this.props.setCameraState(false)}
            >
              <CameraNavigator />
            </Modal>
  
            <FotaNavigator />
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

const FotaNavigator = TabNavigator({
  Home: {
    screen: PhotoList
  },
  /*Search: {
    screen: SearchPage
  },
  Camera: {
    screen: CameraNavigator
  },*/
  Account: {
    screen: ProfilePage
  },
  /*Settings: {
    screen: SettingsPage
  }*/
},
{
  tabBarComponent: Navbar,
  tabBarPosition: 'bottom',
  initialRouteName: 'Home',
  backBehavior: 'initalRoute',
  // tabBarOptions: {
  //   showLabel: false,
  //   activeTintColor: '#FD9627',
  //   inactiveTintColor: '#CBCBCB',
  //   tabStyle: {
  //     height: 30
  //   },
  //   iconStyle: {
  //     width: 10,
  //     height: 10
  //   }
  // }
});

function mapStateToProps({ cameraVisible, loginState }) {
  return { cameraVisible, loginState };
}

export default connect(mapStateToProps, { setCameraState, logInOrOut })(Base);
