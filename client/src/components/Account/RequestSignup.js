import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '../common';

const RequestSignup = (props) => (
  <View style={styles.pageStyle}>
    <Text style={styles.textStyle}>{props.text}</Text>
    <Button
      style={{ marginVertical: 8 }}
      onPress={() => props.navigation.navigate('Login', { 
        onLoginFinished: props.onLoginFinished,
        goto: 'Signup' 
      })}
      colors={{ text: '#fff', fill: '#ff9700', border: '#ff9700' }}
      text={'Create an Account'}
      round
    />
    <Button
      style={{ marginVertical: 8 }}
      onPress={() => props.navigation.navigate('Login', { 
        onLoginFinished: props.onLoginFinished,
        goto: 'Login' 
      })}
      colors={{ text: '#fff', fill: '#ff9700', border: '#ff9700' }}
      text={'Log In'}
      round
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
