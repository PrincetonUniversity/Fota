/******************************************************************************
 * Called by:
 *
 * Dependencies: Base
 *
 * Description: React Native App file. Sets up redux.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import reducers from './reducers';
import Base from './Base';

class App extends Component {
  render() {
    const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
    AsyncStorage.setItem('SearchRadius', '1');
    return (
      <Provider store={createStoreWithMiddleware(reducers, { cameraVisible: false })}>
        <Base />
      </Provider>
    );
  }
}

export default App;
