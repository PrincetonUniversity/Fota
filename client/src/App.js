import React, { Component } from 'react';
import { Navigator } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import BlankPage from './components/BlankPage';
import Navbar from './components/Navbar';

class App extends Component {
  configureScene(route, routeStack) {
    if (routeStack.length < 2 || route.id > routeStack[routeStack.length - 2].id) {
      return ({ ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: {} });
    }
    return ({ ...Navigator.SceneConfigs.HorizontalSwipeJumpFromLeft, gestures: {} });
  }

  renderScene(route, navigator) {
    switch (route.id) {
      case 0:
        return <HomePage />;
      case 1:
        return <SearchPage />;
      default:
        return <BlankPage />;
    }
  }

  render() {
    return (
     <Provider store={createStore(reducers)}>
        <Navigator
          style={{ flex: 1 }}
          initialRoute={{ id: 0 }}
          renderScene={this.renderScene}
          configureScene={this.configureScene}
          navigationBar={<Navbar />}
        />
      </Provider>
    );
  }
}

export default App;
