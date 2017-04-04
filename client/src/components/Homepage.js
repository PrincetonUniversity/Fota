import React from 'react';
import { ScrollView } from 'react-native';
import Headbar from './Headbar';
import PhotoList from './PhotoList';

const Homepage = () => (
  <ScrollView>
    <Headbar />
    <PhotoList />
  </ScrollView>
);

export default Homepage;
