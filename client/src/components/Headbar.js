import React from 'react';
import { View, Text } from 'react-native';
import { Header } from './common';
import PhotoToggler from './PhotoToggler';
//import Searchbar from './Searchbar';

const Headbar = () => (
  <Header>
    {/* Searchbar */}
    <Text style={styles.searchStyle}>Search</Text>
    {/*Popular/New*/}
    <View style={styles.toggleStyle}><PhotoToggler /></View>
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
