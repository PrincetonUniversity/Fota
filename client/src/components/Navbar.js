import React from 'react';
import { ImageButton, Footer } from './common';
import { footerSize, circleSize } from './common/Footer';

const Navbar = () => (
  <Footer>
    <ImageButton
      onPress={() => console.log('Burger!')}
      source={require('../img/test1.png')}
      style={styles.imgStyle}
    />
    <ImageButton
      onPress={() => console.log('Coffee!')}
      source={require('../img/test2.png')}
      style={styles.camImgStyle}
    />
    <ImageButton
      onPress={() => console.log('Donut!')}
      source={require('../img/test3.png')}
      style={styles.imgStyle}
    />
  </Footer>
);

const styles = {
  imgStyle: {
    width: footerSize - 25,
    height: footerSize - 25
  },
  camImgStyle: {
    width: circleSize - 25,
    height: circleSize - 25
  }
};

export default Navbar;
