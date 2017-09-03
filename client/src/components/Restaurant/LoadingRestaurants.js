import React from 'react';
import { View, StatusBar } from 'react-native';

const LoadingRestaurants = () => (
  <View style={{ flex: 1, backgroundColor: 'white' }}>
    <StatusBar animated barStyle='light-content' />
    <View style={{ height: 175, backgroundColor: '#d3d3d3' }} />
    <View style={styles.tabBarStyle} />
    <View style={{ flex: 1 }} />
    <View style={styles.footerStyle}>
      {/* <View style={[styles.bottomSpacerStyle, { borderRightWidth: 1 }]} /> */}
      {/* <View style={styles.bottomSpacerStyle} /> */}
    </View>
  </View>
);

const styles = {
  // infoContainerStyle: {
  //   height: 73.5,
  //   backgroundColor: 'white',
  //   zIndex: 4,
  //   marginHorizontal: 30,
  //   //borderTopWidth: 1,
  //   //borderBottomWidth: 1,
  //   borderColor: 'rgba(0, 0, 0, 0.2)'
  // },
  tabBarStyle: {
    height: 203,
    backgroundColor: 'white',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
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
