/******************************************************************************
 * Called by: Restaurant/CommentDetail
 * Dependencies: Account/LoginForm, Account/UserPage, Restaurant/RestaurantDetail
 *
 * Description: A text button. For an image button, see ./ImageButton.
 *
 ******************************************************************************/

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientButton = (props) => (
  <TouchableOpacity onPress={props.onPress} style={props.style}>
    <View style={styles.buttonStyle}>
      <LinearGradient
        style={{ flex: 1, borderRadius: 20 }}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        colors={props.colors}
      >
        <Text style={styles.textStyle}>{props.text}</Text>
      </LinearGradient>
    </View>
  </TouchableOpacity>
);

const styles = {
  textStyle: {
    backgroundColor: 'transparent',
    alignSelf: 'center',
    color: 'white',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
    padding: 8,
  },
  buttonStyle: {
    //flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
};

export { GradientButton };
