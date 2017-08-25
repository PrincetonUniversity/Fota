/******************************************************************************
 * Called by: Restaurant/CommentDetail
 * Dependencies: Account/LoginForm, Account/UserPage, Restaurant/RestaurantDetail
 *
 * Description: A text button. For an image button, see ./ImageButton.
 *
 ******************************************************************************/

import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = (props) => {
  let colors = props.colors;
  if (colors == null) {
    colors = { text: '#aaa', fill: '#fff', border: '#aaa' };
  }
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{ 
        backgroundColor: colors.fill,
        borderColor: colors.border,
        borderRadius: props.round ? 18 : 0,
        ...styles.buttonStyle
      }}
    >
      {props.children}
      <Text style={{ color: colors.text, ...styles.textStyle }}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '500',
    padding: 10,
  },
  buttonStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    margin: 1
  }
};

export { Button };
