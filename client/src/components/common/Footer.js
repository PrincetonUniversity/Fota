import React from 'react';
import { View } from 'react-native';

const Footer = (props) => (
  <View style={styles.footerStyle}>
    <View style={styles.barStyle} />
    <View style={styles.circleStyle} />
    <View style={styles.itemStyle}>
      {props.children}
    </View>
  </View>
);

const styles = {
  footerStyle: {
    height: 60,
    justifyContent: 'flex-end',
    alignItems: 'center',
    elevation: 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  barStyle: {
    backgroundColor: '#f8f8f8',
    height: 45,
    position: 'absolute',
    left: 0,
    right: 0
  },
  circleStyle: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#f8f8f8',
    position: 'absolute'
  },
  itemStyle: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 45,
    paddingBottom: 10
  }
};

export { Footer };
