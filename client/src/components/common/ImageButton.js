import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

const ImageButton = ({ style, onPress, source }) => (
  <TouchableOpacity
    style={{ width: style.width, height: style.height, flex: style.flex }}
    onPress={onPress}
  >
    <Image
       style={{ width: style.width, height: style.height, resizeMode: 'stretch' }}
       source={source}
    />
  </TouchableOpacity>
);

export { ImageButton };
