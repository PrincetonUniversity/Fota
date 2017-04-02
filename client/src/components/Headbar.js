import React from 'react';
import { Text } from 'react-native';
import { Header } from './common';
//import Searchbar from './Searchbar';

const Headbar = () => (
  <Header>
    {/* Searchbar */}
    <Text style={styles.searchStyle}>Search</Text>
    {/*Popular/New*/}
    <Text style={styles.toggleStyle}>Popular</Text>
  </Header>
);

const styles = {
  searchStyle: {
    textAlign: 'center',
    flex: 2
  },
  toggleStyle: {
    textAlign: 'center',
    flex: 1
  }
};

export default Headbar;
