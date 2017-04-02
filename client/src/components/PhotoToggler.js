import React, { Component } from 'react';
import { TouchableOpacity, Text } from 'react-native';

class PhotoToggler extends Component {
  state = { hot: true }

  render() {
    return (
      <TouchableOpacity onPress={() => this.setState(!this.state.hot)}>
        <Text>{this.state.hot ? 'Hot' : 'New'}</Text>
      </TouchableOpacity>
    );
  }
}

export default PhotoToggler;
