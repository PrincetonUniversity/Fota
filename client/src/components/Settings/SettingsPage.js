import React from 'react';
import { Text, View } from 'react-native';
import { Header } from '../common';

const SettingsPage = () => (
  <View>
    <Header>
      <Text style={styles.headerTextStyle}>Settings</Text>
    </Header>
  </View>
);

const styles = {
  headerTextStyle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontSize: 20,
    color: '#000'
  }
};

export default SettingsPage;
