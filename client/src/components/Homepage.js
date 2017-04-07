import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import Headbar from './Headbar';
import PhotoList from './PhotoList';
import { footerSize } from './common/Footer';

class HomePage extends Component {
  state = { modalVisible: true };

  render() {
    return (
      <ScrollView style={{ marginBottom: footerSize }}>
        <Headbar />
        <PhotoList />
      </ScrollView>
    );
  }
}

export default HomePage;
