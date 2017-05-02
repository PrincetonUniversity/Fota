// Header at the top with search and order toggle

import React from 'react';
import { View } from 'react-native';
import { Header } from './common';
import OrderToggler from './OrderToggler';

const Headbar = () => (
  <Header>
    <View style={styles.toggleStyle}><OrderToggler /></View>
  </Header>
);

const styles = {
  // headerStyle: {
  //   backgroundColor: '#ff9700',
  //   alignItems: 'center',
  //   height: 50,
  //   paddingHorizontal: 10,
  //   flexDirection: 'row'
  // },
  searchStyle: {
    //backgroundColor: '#00f',
    textAlign: 'center',
    flex: 2
  },
  toggleStyle: {
    alignItems: 'stretch',
    flex: 1
  }
};

export default Headbar;
