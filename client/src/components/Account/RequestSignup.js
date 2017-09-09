import React, { Component } from 'react';
import { View } from 'react-native';
import { Button } from '../common';

class RequestSignup extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 40 }}>
        <Button
          style={{ marginVertical: 8 }}
          onPress={() => this.props.screenProps.onSkip()}
          colors={{ text: '#fff', fill: '#ff9700', border: '#ff9700' }}
          text={'Sign Up'}
          round
        />
        <Button
          style={{ marginVertical: 8 }}
          onPress={() => this.props.navigation.navigate('Login')}
          colors={{ text: '#fff', fill: '#ff9700', border: '#ff9700' }}
          text={'Log In'}
          round
        />
      </View>
    );
  }
}

export default RequestSignup;
