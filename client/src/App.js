import React, { Component } from 'react';
import { Navigator } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import Navbar from './components/Navbar';

class App extends Component {
  renderScene(route, navigator) {
    switch (route.name) {
      case 'Home':
        return <HomePage />;
      case 'Search':
        return <SearchPage />;
      default:
        return <HomePage />;
    }
  }

  render() {
    return (
     <Provider store={createStore(reducers)}>
        <Navigator
          style={{ flex: 1 }}
          initialRoute={{ name: 'Home' }}
          renderScene={this.renderScene}
          navigationBar={<Navbar />}
        />
      </Provider>
    );
  }
}

export default App;
