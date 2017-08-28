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
    <Text 
      numberOfLines={props.numberOfLines}
      ellipsizeMode={props.ellipsizeMode}
      style={{ fontSize: props.size, color: props.color, ...styles.textStyle }}
    >
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
      fontWeight: '400',
      marginLeft: 3,
      marginRight: 3,
    }
};

export { FilterDisplay };
