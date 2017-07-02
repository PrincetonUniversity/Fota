/******************************************************************************
 * Called by: Account/LoginForm, Account/UserPage, Restaurant/RestaurantModal
 * Dependencies:
 *
 * Description: Styling. Used to break up different sections.
 *
 ******************************************************************************/

import React from 'react';
import { View } from 'react-native';

const CardSection = (props) => (
  <View style={styles.containerStyle}>
    {props.children}
  </View>
);

const styles = {
  containerStyle: {
    padding: 10,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'relative'
  }
};

export { CardSection };
