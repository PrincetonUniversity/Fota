/******************************************************************************
 * Called by: Restaurant/RestaurantDetail
 * Dependencies:
 *
 * Description: Visual component for displaying filter tags.
 *
 ******************************************************************************/

import React from 'react';
import { Text, View } from 'react-native';

const FilterMeasurer = (props) => (
  <View
    style={styles.containerStyle}
    onLayout={e => props.addWidth(e.nativeEvent.layout.width + 10)}
  >
    <Text
      numberOfLines={props.numberOfLines}
      ellipsizeMode={props.ellipsizeMode}
      style={{ fontSize: props.size, ...styles.textStyle }}
    >
      {props.text}
    </Text>
  </View>
);

const styles = {
    containerStyle: {
      flex: -1,
      borderRadius: 20,
      borderWidth: 1,
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 1,
      margin: 5,
      borderColor: 'transparent',
      backgroundColor: 'transparent'
    },
    textStyle: {
      fontWeight: '400',
      marginLeft: 3,
      marginRight: 3,
      color: 'transparent',
      backgroundColor: 'transparent'
    }
};

export default FilterMeasurer;
