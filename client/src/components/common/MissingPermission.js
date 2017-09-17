import React from 'react';
import { View, Text } from 'react-native';

const MissingPermission = (props) => (
  <View style={styles.pageStyle}>
    <Text style={styles.textStyle}>
      {`You need to enable ${props.type} permissions to use this. Please turn them on and restart the app.`}
    </Text>
  </View>
);

const styles = {
  pageStyle: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 60,
    paddingVertical: 50,
    justifyContent: 'center'
  },
  textStyle: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center'
  }
};

export { MissingPermission };
