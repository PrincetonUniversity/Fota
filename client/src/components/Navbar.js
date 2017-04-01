import React from 'react';
import { ImageButton, Footer } from './common';
import { footerSize, circleSize } from './common/Footer';

const Navbar = () => (
  <Footer>
    <ImageButton
      onPress={() => console.log('Burger!')}
      source={require('../img/fota_home_button.png')}
      style={styles.imgStyle}
    />
    <ImageButton
      onPress={() => console.log('Coffee!')}
      source={require('../img/camera_button.png')}
      style={styles.camImgStyle}
    />
    <ImageButton
      onPress={() => console.log('Donut!')}
      source={require('../img/account_button.png')}
      style={styles.imgStyle}
    />
  </Footer>
);

const styles = {
  imgStyle: {
    width: footerSize - 23,
    height: footerSize - 21
  },
  camImgStyle: {
    width: circleSize - 15,
    height: circleSize - 15
  }
};

export default Navbar;
