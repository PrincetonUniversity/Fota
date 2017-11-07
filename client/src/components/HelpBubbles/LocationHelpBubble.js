import React from 'react';
import { View, Text, Dimensions } from 'react-native';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const distBottom = HEIGHT - (WIDTH + 10);
const LocationHelpBubble = () => (
  <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}>
    <View style={styles.circleStyle} />
    <View style={styles.cardStyle}>
      <Text style={{ fontWeight: '700', color: 'rgba(0,0,0,0.8)' }}>
        Near you!
      </Text>
      <Text style={{ color: 'rgba(0,0,0,0.8)' }}>
        Every photo is from a nearby restaurant.
      </Text>
      <Text style={{ color: '#ff7f00', marginTop: 5 }}>
        Tap to continue
      </Text>
    </View>
  </View>
);

const styles = {
  circleStyle: {
    backgroundColor: 'white',
    height: 12,
    width: 12,
    borderRadius: 6,
    position: 'absolute',
    left: 72,
    bottom: distBottom - 3
  },
  cardStyle: {
    backgroundColor: 'white',
    borderRadius: 7,
    position: 'absolute',
    bottom: distBottom,
    left: 75,
    right: 75,
    paddingVertical: 10,
    paddingHorizontal: 15
  }
};

export { LocationHelpBubble };
