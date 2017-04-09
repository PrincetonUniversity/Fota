// Navigation bar at the bottom

import React, { Component } from 'react';
import { Navigator } from 'react-native';
import { ImageButton, Footer } from './common';
import { footerSize, circleSize } from './common/Footer';

const styles = {
  imgStyle: {
    width: footerSize - 25,
    height: footerSize - 25
  },
  camImgStyle: {
    width: circleSize - 20,
    height: circleSize - 20
  }
};

const { imgStyle, camImgStyle } = styles;

const homeActivated = require('../img/fota_home_button_activated.png');
const homeUnactivated = require('../img/fota_home_button_unactivated.png');
const searchActivated = require('../img/fota_home_button_activated.png');
const searchUnactivated = require('../img/magnifying_glass.png');
const accountActivated = require('../img/account_button_activated.png');
const accountUnactivated = require('../img/account_button_unactivated.png');
const settingsActivated = require('../img/fota_home_button_activated.png');
const settingsUnactivated = require('../img/fota_home_button_unactivated.png');
const cameraButton = require('../img/camera_button.png');

class Navbar extends Component {
  state = {
    homeSource: homeActivated,
    searchSource: searchUnactivated,
    accountSource: accountUnactivated,
    settingsSource: settingsUnactivated
  }

  renderHome() {
    if (this.props.navigator.getCurrentRoutes().pop().name === 'Home') return;
    this.setState({
      homeSource: homeActivated,
      searchSource: searchUnactivated,
      accountSource: accountUnactivated,
      settingsSource: settingsUnactivated
    });
    this.props.navigator.resetTo({ name: 'Home' });
  }

  renderSearch() {
    if (this.props.navigator.getCurrentRoutes().pop().name === 'Search') return;
    this.setState({
      homeSource: homeUnactivated,
      searchSource: searchActivated,
      accountSource: accountUnactivated,
      settingsSource: settingsUnactivated
    });
    console.log(this.props.navigator.getCurrentRoutes());
    this.props.navigator.push({ name: 'Search' });
  }

  renderAccount() {
    if (this.props.navigator.getCurrentRoutes().pop().name === 'Account') return;
    this.setState({
      homeSource: homeUnactivated,
      searchSource: searchUnactivated,
      accountSource: accountActivated,
      settingsSource: settingsUnactivated
    });
    this.props.navigator.push({ name: 'Account' });
  }

  renderSettings() {
    if (this.props.navigator.getCurrentRoutes().pop().name === 'Settings') return;
    this.setState({
      homeSource: homeUnactivated,
      searchSource: searchUnactivated,
      accountSource: accountUnactivated,
      settingsSource: settingsActivated
    });
    this.props.navigator.push({ name: 'Settings' });
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
