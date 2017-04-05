import React from 'react';
import { View } from 'react-native';

export const footerSize = 50;
export const circleSize = 65;

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
    height: circleSize,
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
    height: footerSize,
    position: 'absolute',
    left: 0,
    right: 0
  },
  circleStyle: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    backgroundColor: '#f8f8f8',
    position: 'absolute'
  },
  itemStyle: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: footerSize,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 12
  }
};

export { Footer };
