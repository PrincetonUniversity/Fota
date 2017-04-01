import React from 'react';
import { View } from 'react-native';
import { ImageButton } from './common/ImageButton';

const Navbar = () => {
  const { footerStyle, imgStyle } = styles;

  return (
    <View style={footerStyle}>
      <ImageButton
        onPress={() => console.log('Burger!')}
        source={require('../img/test1.png')}
        style={imgStyle}
      />
      <ImageButton
        onPress={() => console.log('Coffee!')}
        source={require('../img/test2.png')}
        style={imgStyle}
      />
      <ImageButton
        onPress={() => console.log('Donut!')}
        source={require('../img/test3.png')}
        style={imgStyle}
      />
    </View>
  );
};

const styles = {
  footerStyle: {
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  imgStyle: {
    width: 25,
    height: 25
  },
  camStyle: {}
};

export default Navbar;
