import React from 'react';
import { View } from 'react-native';

const Card = (props) => (
  <View style={styles.containerStyle}>
    {props.children}
  </View>
);


const styles = {
  containerStyle: {
    flex: 1
  }
};

export { Card };
