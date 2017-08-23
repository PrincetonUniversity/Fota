import React from 'react';
import { Image, View, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export const dealWithAndroidBeingStupid = (borderRadius) => {
  if (Platform.OS === 'android') {
    return (
      <View 
        style={{
          position: 'absolute',
          top: -borderRadius,
          bottom: -borderRadius, 
          right: -borderRadius,
          left: -borderRadius,
          borderRadius: borderRadius * 2,
          borderWidth: borderRadius,
          borderColor: '#fff',
          zIndex: 5
        }}
      />
    );
  }
};

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
    {dealWithAndroidBeingStupid(photoStyle.borderRadius)}
  </Image>
);

export { GradientImage };
