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
  <View style={styles.containerStyle}>
    <Text style={styles.textStyle}>
      {props.text}
    </Text>
  </View>
);


const styles = {
    containerStyle: {
      flex: -1,
      borderRadius: 20,
      backgroundColor: 'transparent',
      borderColor: 'white',
      borderWidth: 1,
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 1,
      margin: 5
    },
    textStyle: {
      color: 'white',
      fontFamily: 'Avenir',
      fontSize: 12,
      marginLeft: 3,
      marginRight: 3,
      textAlign: 'justify'
    }
};

export { FilterDisplay };
