import React from 'react';
import { View, Text, Image } from 'react-native';
import { GradientButton } from '../common';

const noAccountPhoto = require('../../img/no_account.png');

const RequestSignup = (props) => (
  <View style={styles.pageStyle}>
    <View style={{ alignItems: 'center' }}>
      <Image source={noAccountPhoto} style={styles.imageStyle} resizeMode='contain' />
    </View>
    <Text style={styles.textStyle}>{props.text}</Text>
    <GradientButton
      style={{ marginVertical: 8 }}
      onPress={() => props.navigation.navigate('Login', {
        onLoginFinished: props.onLoginFinished,
        goto: 'Signup'
      })}
      colors={['#ff5b13', '#ff7b1f']}
      // colors={{ text: '#fff', fill: '#ff7f00', border: '#ff7f00' }}
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
      // colors={{ text: '#fff', fill: '#ff7f00', border: '#ff7f00' }}
      text={'LOG IN'}
      //round
    />
  </View>
);

const styles = {
  imageStyle: {
    width: 98,
    height: 182
  },
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
