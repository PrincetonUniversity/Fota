import React from 'react';
import { View, Text, Dimensions } from 'react-native';

const WIDTH = Dimensions.get('window').width;

const distTop = 265;
const RestaurantHelpBubble = () => (
  <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}>
    <View style={styles.circleStyle} />
    <View style={styles.cardStyle}>
      <Text style={{ fontWeight: '700', color: 'rgba(0,0,0,0.8)' }}>
        Rating
      </Text>
      <Text style={{ color: 'rgba(0,0,0,0.8)' }}>
        Restaurants are rated by users like you - tap to cast a vote!
      </Text>
      <Text style={{ color: '#ff7f00', marginTop: 5 }}>
        Got it
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
    left: WIDTH / 2 - 6,
    top: distTop - 6
  },
  cardStyle: {
    backgroundColor: 'white',
    borderRadius: 7,
    position: 'absolute',
    top: distTop,
    left: 75,
    right: 75,
    paddingVertical: 10,
    paddingHorizontal: 15
  }
};

export { RestaurantHelpBubble };
