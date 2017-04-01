import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';
import { Header } from './components/common';
import PhotoList from './components/PhotoList';

const App = () => {
    return (
       <Provider store={createStore(reducers)}>
            <View>
                <Header headerText='Fota' />
                <PhotoList />
            </View>
        </Provider>
    );
};

export default App;
