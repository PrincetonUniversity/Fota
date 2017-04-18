import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

const ImageButton = ({ style, onPress, source, activeOpacity }) => (
  <TouchableOpacity
    style={style}
    onPress={onPress}
    activeOpacity={activeOpacity}
  >
    <Image
      style={{ width: style.width,
               height: style.height,
               resizeMode: 'cover',
               borderRadius: style.borderRadius,
               padding: 13
              }}
      source={source}
    />
  </TouchableOpacity>
);

export { ImageButton };
