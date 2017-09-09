import React from 'react';
import { View, Text } from 'react-native';
import { GradientButton, Button } from '../common';

const RequestSignup = (props) => (
  <View style={styles.pageStyle}>
    <Text style={styles.textStyle}>{props.text}</Text>
    <GradientButton
      style={{ marginVertical: 8 }}
      onPress={() => props.navigation.navigate('Login', {
        onLoginFinished: props.onLoginFinished,
        goto: 'Signup'
      })}
      colors={['#ff5b13', '#ff7b1f']}
      // colors={{ text: '#fff', fill: '#ff9700', border: '#ff9700' }}
      text={'CREATE AN ACCOUNT'}
      //round
    />
    <GradientButton
      style={{ marginVertical: 8 }}
      onPress={() => props.navigation.navigate('Login', {
        onLoginFinished: props.onLoginFinished,
        goto: 'Login'
      })}
      colors={['#ff5b13', '#ff7b1f']}
      // colors={{ text: '#fff', fill: '#ff9700', border: '#ff9700' }}
      text={'LOG IN'}
      //round
    />
  </View>
);

const styles = {
  pageStyle: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 40
  },
  textStyle: {
    fontWeight: '700',
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 15
  }
};

export default RequestSignup;
