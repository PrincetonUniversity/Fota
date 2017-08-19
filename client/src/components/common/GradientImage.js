import React from 'react';
import { Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientImage = ({ children, start, end, colors, gradientStyle, photoStyle, source }) => (
  <Image
    source={{ uri: source }}
    style={photoStyle}
  >
    <LinearGradient
      start={start}
      end={end}
      colors={colors}
      style={gradientStyle}
    >
      {children}
    </LinearGradient>
  </Image>
);

export { GradientImage };
