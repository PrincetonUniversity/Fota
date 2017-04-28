import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = ({ onPress, children }) => {
  const { buttonStyles, textStyle } = styles;
  return (
      <TouchableOpacity onPress={onPress} style={buttonStyles}>
          <Text style={textStyle}>
              {children}
          </Text>
      </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
      alignSelf: 'center',
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      padding: 7
      // paddingTop: 7,
      // paddingBottom: 7,
  },
  buttonStyles: {
      flex: -1,
      alignSelf: 'stretch',
      backgroundColor: '#ff9700',
      marginLeft: 10,
      marginRight: 10
  }
};

export { Button };
