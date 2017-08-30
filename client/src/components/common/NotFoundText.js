import React from 'react';
import { View, Text } from 'react-native';

const NotFoundText = (props) => {
  let style = { flex: 1, ...styles.viewStyle };
  if (props.height) {
    style = { height: props.height, ...styles.viewStyle };
  }
  return (
    <View style={style}>
      <Text style={styles.textStyle}>
        {props.text}
      </Text>
    </View>
  );
};

const styles = {
  viewStyle: {
    paddingHorizontal: 30,
    justifyContent: 'center'
  },
  textStyle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.3)',
  }
};

export { NotFoundText };
