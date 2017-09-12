import React from 'react';
import { View, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';

const pulse = {
  from: {
    opacity: 0.5,
  },
  to: {
    opacity: 1,
  },
};

const LoadingRestaurants = () => (
  <View style={{ flex: 1, backgroundColor: 'white' }}>
    <StatusBar animated barStyle='light-content' />
    <Animatable.View animation={pulse} direction='alternate-reverse' iterationCount='infinite' easing='ease-in-out-sine' style={{ height: 175, backgroundColor: 'rgba(0, 0, 0, 0.22)' }} useNativeDriver />
    <View style={styles.tabBarStyle} />
    <View style={{ flex: 1 }} />
    <View style={styles.footerStyle} />
  </View>
);

const styles = {
  tabBarStyle: {
    height: 203,
    backgroundColor: 'white',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  footerStyle: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 20,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.17,
    shadowRadius: 5,
  },
  bottomSpacerStyle: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(0, 0, 0, 0.2)'
  }
};

export default LoadingRestaurants;
