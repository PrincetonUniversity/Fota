import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import reducers from './reducers';
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
}

export default App;
