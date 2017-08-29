/******************************************************************************
 * Called by:
 * Dependencies: LinearGradient
 *
 * Description: Visual component for a spaced header with a linear gradient
 * at the top of a page.
 *
 ******************************************************************************/

import React from 'react';
import { View, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientHeader = ({ children, start, end, colors, style }) => (
  <LinearGradient
    start={start}
    end={end}
    colors={colors}
    style={style}
  >
    <View style={styles.viewStyle}>
      {children}
    </View>
  </LinearGradient>
);

const styles = {
  viewStyle: {
    alignItems: 'center',
    height: 85,
    marginTop: (Platform.OS === 'ios') ? 15 : 0,
    position: 'relative',
    flexDirection: 'column',
  }
};

export { GradientHeader };
