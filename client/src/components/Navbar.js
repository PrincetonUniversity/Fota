import React from 'react';
import { ImageButton, Footer } from './common';

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
    width: 20,
    height: 20
  },
  camImgStyle: {
    width: 30,
    height: 30
  }
};

export default Navbar;
