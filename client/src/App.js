/******************************************************************************
 * Called by:
 *
 * Dependencies: Base
 *
 * Description: React Native App file. Sets up redux.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { AsyncStorage, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import { setCustomText, setCustomTextInput } from 'react-native-global-props';

import reducers from './reducers';
import Base from './Base';

const customTextProps = {
  style: {
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'NunitoSans'
  }
};

setCustomText(customTextProps);
setCustomTextInput(customTextProps);

class App extends Component {
  constructor() {
    super();
    console.ignoredYellowBox = ['Setting a timer'];
  }

  render() {
    const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
    AsyncStorage.getItem('SearchRadius').then(radius => {
      if (radius == null) AsyncStorage.setItem('SearchRadius', '10');
    });

    return (
      <Provider store={createStoreWithMiddleware(reducers)}>
        <Base />
      </Provider>
    );
  }
}

export default App;
