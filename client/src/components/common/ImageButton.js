import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

const ImageButton = ({ style, onPress, source, activeOpacity }) => (
  <TouchableOpacity
    style={{
      width: style.width,
      height: style.height,
      flex: style.flex,
      marginLeft: style.marginLeft,
      marginRight: style.marginRight
    }}
    onPress={onPress}
    activeOpacity={activeOpacity}
  >
    <Image
      style={{ width: style.width, height: style.height, resizeMode: 'cover'
      }}
      source={source}
    />
  </TouchableOpacity>
);

export { ImageButton };
