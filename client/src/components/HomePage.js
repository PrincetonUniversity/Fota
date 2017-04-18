import React from 'react';
import { View } from 'react-native';
import PhotoList from './PhotoList';
import { footerSize } from './common/Footer';

const HomePage = () => (
  <View style={{ flex: 1, marginBottom: footerSize }}>
    <PhotoList />
  </View>
);

export default HomePage;
