import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../selection.json';

const Icon = createIconSetFromIcoMoon(icoMoonConfig);

class SubmittedComments extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused }) => {
      let color = 'rgba(0,0,0,0.21)';
      if (focused) {
        color = '#ff9700';
      }
      return (
        <Icon
          name={'comments'}
          color={color}
          size={20}
        />
      );
    }
  };

  render() {
    return <Text>Not done yet 4!</Text>;
  }
}

export default SubmittedComments;
