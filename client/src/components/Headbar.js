// Header at the top with search and order toggle

import React from 'react';
import { View, Text } from 'react-native';
import { Header } from './common';
import OrderToggler from './OrderToggler';

const Headbar = () => (
  <Header>
    {/* Filters */}
    <Text style={styles.searchStyle}>Filters</Text>
    {/*Popular/New*/}
    <View style={styles.toggleStyle}><OrderToggler /></View>
  </Header>
);

const styles = {
  searchStyle: {
    //backgroundColor: '#00f',
    textAlign: 'center',
    flex: 2
  },
  toggleStyle: {
    //backgroundColor: '#f00',
    alignItems: 'stretch',
    flex: 1
  }
};

export default Headbar;
