import React, { Component } from 'react';
import axios from 'axios';
import { View, Image, Text } from 'react-native';

class RestaurantDetail extends Component {

  componentWillMount() {
    axios.get();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>

      </View>
    );
  }
}

export default RestaurantDetail;
