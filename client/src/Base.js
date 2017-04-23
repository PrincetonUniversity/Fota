import React, { Component } from 'react';
import { View, Navigator, Modal } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import BlankPage from './components/BlankPage';
import AccountPage from './components/AccountPage';
import Navbar from './components/Navbar';
import CameraNavigator from './components/CameraNavigator';
import { setCameraState, logInOrOut } from './actions';

class Base extends Component {
  constructor(props) {
    super(props);
    this.state = { loginFinished: false };
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.props.logInOrOut(user);
      this.setState({ loginFinished: true });
    });
  }

  configureScene(route, routeStack) {
    if (routeStack.length < 2 || route.id > routeStack[routeStack.length - 2].id) {
      return ({ ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: {} });
    }
    return ({ ...Navigator.SceneConfigs.HorizontalSwipeJumpFromLeft, gestures: {} });
  }

  renderScene(route) {
    switch (route.id) {
      case 0:
        return <HomePage />;
      case 1:
        return <SearchPage />;
      case 2:
        return <AccountPage />;
      default:
        return <BlankPage />;
    }
  }

  render() {
    if (this.state.loginFinished) {
      return (
        <View style={{ flex: 1 }}>
          <Modal
            visible={this.props.cameraVisible}
            style={{ flex: 1 }}
            onRequestClose={() => this.props.setCameraState(false)}
          >
            <CameraNavigator />
            {/* <CameraPage /> */}
          </Modal>

          <Navigator
            style={{ flex: 1, backgroundColor: '#fff' }}
            initialRoute={{ id: 0 }}
            renderScene={this.renderScene.bind(this)}
            // configureScene={this.configureScene}
            navigationBar={<Navbar />}
          />
        </View>
      );
    } return (<View />);
  }
}

function mapStateToProps({ cameraVisible }) {
  return { cameraVisible };
}

export default connect(mapStateToProps, { setCameraState, logInOrOut })(Base);
