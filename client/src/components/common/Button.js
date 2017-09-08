/******************************************************************************
 * Called by: Restaurant/CommentDetail
 * Dependencies: Account/LoginForm, Account/UserPage, Restaurant/RestaurantDetail
 *
 * Description: A text button. For an image button, see ./ImageButton.
 *
 ******************************************************************************/

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Button = (props) => {
  let colors = props.colors;
  if (colors == null) {
    colors = { text: '#aaa', fill: '#fff', border: '#aaa' };
  }
  return (
    <TouchableOpacity onPress={props.onPress} style={props.style}>
      <View
        style={{
          backgroundColor: colors.fill,
          borderColor: colors.border,
          borderRadius: props.round ? 20 : 0,
          ...styles.buttonStyle
        }}
      >
        {props.children}
        <Text
          style={{
            color: colors.text,
            fontWeight: props.round ? '800' : '900',
            letterSpacing: props.round ? 0 : 1,
            ...styles.textStyle
          }}
        >
          {props.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    fontSize: 15,
    padding: 8,
  },
  buttonStyle: {
    //flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    margin: 1
  }
};

export { Button };
