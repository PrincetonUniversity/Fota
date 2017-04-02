import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';
import PhotoList from './components/PhotoList';
import Navbar from './components/Navbar';

const App = () => {
    return (
       <Provider store={createStore(reducers)}>
            <View style={{ flex: 1 }}>
                <PhotoList />
                <Navbar />
            </View>
        </Provider>
    );
};

export default App;
