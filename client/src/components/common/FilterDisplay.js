/******************************************************************************
 * Called by: Restaurant/RestaurantDetail
 * Dependencies:
 *
 * Description: Visual component for displaying filter tags.
 *
 ******************************************************************************/

import React from 'react';
import { Text, View } from 'react-native';

const FilterDisplay = (props) => (
  <View style={{ borderColor: props.color, ...styles.containerStyle }}>
    <Text style={{ color: props.color, ...styles.textStyle }}>
      {props.text}
    </Text>
  </View>
);


const styles = {
    containerStyle: {
      flex: -1,
      borderRadius: 20,
      backgroundColor: 'transparent',
      borderWidth: 1,
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 1,
      margin: 5
    },
    textStyle: {
      fontSize: 14,
      fontWeight: '500',
      marginLeft: 3,
      marginRight: 3,
    }
};

export { FilterDisplay };
