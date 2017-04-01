import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';
import { Header, ImageButton } from './components/common';

const App = () => {
    return (
       <Provider store={createStore(reducers)}>
            <View>
                <Header headerText='Fota' />
                <ImageButton
                  onPress={() => console.log('Button Pressed.')}
                  source={require('./img/fota.jpg')}
                  style={{ width: 200, height: 100 }}
                />
            </View>
        </Provider>
    );
};

export default App;
