import React, { Component } from 'react';
// import { Navigator, Modal } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import reducers from './reducers';
// import HomePage from './components/HomePage';
// import SearchPage from './components/SearchPage';
// import BlankPage from './components/BlankPage';
// import AccountPage from './components/AccountPage';
// import Navbar from './components/Navbar';
// import CameraPage from './components/CameraPage';
import Base from './Base';

class App extends Component {
  render() {
    const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
    return (
      <Provider store={createStoreWithMiddleware(reducers, { cameraVisible: false })}>
        <Base />
      </Provider>
    );
  }
  // configureScene(route, routeStack) {
  //   if (routeStack.length < 2 || route.id > routeStack[routeStack.length - 2].id) {
  //     return ({ ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: {} });
  //   }
  //   return ({ ...Navigator.SceneConfigs.HorizontalSwipeJumpFromLeft, gestures: {} });
  // }
  //
  // renderScene(route) {
  //   switch (route.id) {
  //     case 0:
  //       return <HomePage />;
  //     case 1:
  //       return <SearchPage />;
  //     case 2:
  //       return <AccountPage />;
  //     default:
  //       return <BlankPage />;
  //   }
  // }
  //
  // render() {
  //   const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
  //   return (
  //     <Provider store={createStoreWithMiddleware(reducers)}>
  //       <Modal
  //         visible={this.props.cameraVisible}
  //         style={{ flex: 1 }}
  //       >
  //         <CameraPage />
  //       </Modal>
  //
  //       <Navigator
  //         style={{ flex: 1, backgroundColor: '#fff' }}
  //         initialRoute={{ id: 0 }}
  //         renderScene={this.renderScene.bind(this)}
  //         configureScene={this.configureScene}
  //         navigationBar={<Navbar />}
  //       />
  //     </Provider>
  //   );
  // }
}

export default App;
