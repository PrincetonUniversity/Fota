// The hot/new button

import React, { Component } from 'react';
import { TouchableOpacity, Text } from 'react-native';

class OrderToggler extends Component {
  state = { hot: true }

  render() {
    return (
      <TouchableOpacity
        style={styles.containerStyle}
        onPress={() => this.setState({ hot: !this.state.hot })}
      >
        <Text>{this.state.hot ? 'Hot' : 'New'}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
};

export default OrderToggler;
