import React from 'react';
import { View, Text, Image } from 'react-native';

const rewardProgress = require('../../img/reward_progress.png');

const VoteHelpBubble = () => (
  <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center' }}>
    <View style={styles.cardStyle}>
      <Text style={styles.titleStyle}>
        Rewards!
      </Text>
      <Text style={{ color: 'rgba(0,0,0,0.8)', textAlign: 'center', fontSize: 14 }}>
        Congrats on your first vote! Keep going to earn free food and discounts. You can keep track of your progress on your profile page.
      </Text>
      <Image
        source={rewardProgress}
        style={{ width: 96, height: 85, alignSelf: 'center', marginVertical: 10 }}
      />
      <Text style={{ color: '#ff7f00', marginTop: 5, textAlign: 'center', fontSize: 14 }}>
        Got it
      </Text>
    </View>
  </View>
);

const styles = {
  titleStyle: {
    fontWeight: '700',
    color: 'rgba(0,0,0,0.8)',
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 5
  },
  cardStyle: {
    backgroundColor: 'white',
    borderRadius: 13,
    marginHorizontal: 50,
    padding: 20,
  }
};

export { VoteHelpBubble };
