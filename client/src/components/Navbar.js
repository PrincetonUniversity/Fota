import React, { Component } from 'react';
import { ImageButton, Footer } from './common';
import { footerSize, circleSize } from './common/Footer';

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

const { imgStyle, camImgStyle } = styles;

const homeActivated = require('../img/fota_home_button_activated.png');
const homeUnactivated = require('../img/fota_home_button_unactivated.png');
const accountActivated = require('../img/account_button_activated.png');
const accountUnactivated = require('../img/account_button_unactivated.png');
const cameraButton = require('../img/camera_button.png');

class Navbar extends Component {
  state = { homeSource: homeActivated, accountSource: accountUnactivated }

  renderHome() {
    this.setState({ homeSource: homeActivated, accountSource: accountUnactivated });
  }

  renderAccount() {
    this.setState({ homeSource: homeUnactivated, accountSource: accountActivated });
  }

  render() {
    return (
      <Footer>
        <ImageButton
          onPress={() => this.renderHome()}
          source={this.state.homeSource}
          style={imgStyle}
        />
        <ImageButton
          onPress={() => console.log('Camera!')}
          source={cameraButton}
          style={camImgStyle}
        />
        <ImageButton
          onPress={() => this.renderAccount()}
          source={this.state.accountSource}
          style={imgStyle}
        />
      </Footer>
    );
  }
}

export default Navbar;
