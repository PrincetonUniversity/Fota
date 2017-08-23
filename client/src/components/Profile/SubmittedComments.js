import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class SubmittedComments extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused }) => {
      let color = '#ccc';
      if (focused) {
        color = '#ff9700';
      }
      return (
        <Icon
          name={'comment-processing'}
          color={color}
          size={30}
        />
      );
    }
  };

  render() {
    return <Text>Not done yet 4!</Text>;
  }
}

export default SubmittedComments;
