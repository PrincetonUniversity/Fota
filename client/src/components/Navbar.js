// Navigation bar at the bottom

import React, { Component } from 'react';
import { ImageButton, Footer } from './common';
import { footerSize, circleSize } from './common/Footer';

const styles = {
  imgStyle: {
    width: footerSize - 30,
    height: footerSize - 30
  },
  camImgStyle: {
    width: circleSize - 25,
    height: circleSize - 25
  }
};

const { imgStyle, camImgStyle } = styles;

const homeActivated = require('../img/fota_home_button_activated.png');
const homeUnactivated = require('../img/fota_home_button_unactivated.png');
const searchActivated = require('../img/fota_home_button_activated.png');
const searchUnactivated = require('../img/fota_home_button_unactivated.png');
const accountActivated = require('../img/account_button_activated.png');
const accountUnactivated = require('../img/account_button_unactivated.png');
const settingsActivated = require('../img/account_button_activated.png');
const settingsUnactivated = require('../img/account_button_unactivated.png');
const cameraButton = require('../img/camera_button.png');

class Navbar extends Component {
  state = {
    homeSource: homeActivated,
    searchSource: searchUnactivated,
    accountSource: accountUnactivated,
    settingsSource: settingsUnactivated
  }

  renderHome() {
    this.setState({
      homeSource: homeActivated,
      searchSource: searchUnactivated,
      accountSource: accountUnactivated,
      settingsSource: settingsUnactivated
    });
  }

  renderSearch() {
    this.setState({
      homeSource: homeUnactivated,
      searchSource: searchActivated,
      accountSource: accountUnactivated,
      settingsSource: settingsUnactivated
    });
  }

  renderAccount() {
    this.setState({
      homeSource: homeUnactivated,
      searchSource: searchUnactivated,
      accountSource: accountActivated,
      settingsSource: settingsUnactivated
    });
  }

  renderSettings() {
    this.setState({
      homeSource: homeUnactivated,
      searchSource: searchUnactivated,
      accountSource: accountUnactivated,
      settingsSource: settingsActivated
    });
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
          onPress={() => this.renderSearch()}
          source={this.state.searchSource}
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
        <ImageButton
          onPress={() => this.renderSettings()}
          source={this.state.settingsSource}
          style={imgStyle}
        />
      </Footer>
    );
  }
}

export default Navbar;
