import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

const ImageButton = ({ style, onPress, source, activeOpacity }) => (
  <TouchableOpacity
    style={{ width: style.width, height: style.height, flex: style.flex }}
    onPress={onPress}
    activeOpacity={activeOpacity}
  >
    <Image
       style={{ width: style.width, height: style.height, resizeMode: 'stretch' }}
       source={source}
    />
  </TouchableOpacity>
);

export { ImageButton };
