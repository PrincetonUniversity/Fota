import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

const ImageButton = (props) => (
  <TouchableOpacity
    style={{ width: props.style.width, height: props.style.height, alignItems: 'center' }}
    onPress={props.onPress}
  >
    <Image
       style={{ width: props.style.width, height: props.style.height }}
       source={props.source}
    />
  </TouchableOpacity>
);

export { ImageButton };
