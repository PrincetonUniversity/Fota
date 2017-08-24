/******************************************************************************
 * Called by: Base
 * Dependencies: redux, common/ImageButton, common/Footer
 *
 * Description: Bottom navigation bar. Leads to the home page (Photo/PhotoList),
 * the search page (Search/SearchPage), the camera page (Camera/CameraNavigator),
 * the account page (Account/AccountPage), or the settings page
 * (Settings/SettingsPage).
 *
 ******************************************************************************/

// Navigation bar at the bottom

import React, { Component } from 'react';
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

const homeActivated = require('../img/fota_home_activated.png');
const homeUnactivated = require('../img/fota_home_unactivated.png');
//const searchActivated = require('../img/magnifying_glass_activated.png');
//const searchUnactivated = require('../img/magnifying_glass_unactivated.png');
const accountActivated = require('../img/account_activated.png');
const accountUnactivated = require('../img/account_unactivated.png');
//const settingsActivated = require('../img/settings_activated.png');
//const settingsUnactivated = require('../img/settings_unactivated.png');
const cameraButton = require('../img/camera_button.png');

class Navbar extends Component {
  state = {
    homeSource: homeActivated,
    accountSource: accountUnactivated,
  }

  componentWillMount() {
    this.props.setNavigator(this);
  }

  /*getTransition(current, next) {
    if next > current
  }*/

  renderHome() {
    //console.log(this.props.navigation);
    this.setState({
      homeSource: homeActivated,
      accountSource: accountUnactivated
    });
    this.props.navigation.navigate('Home');
  }

  renderAccount() {
    //console.log(this.props.navigation);
    this.setState({
      homeSource: homeUnactivated,
      accountSource: accountActivated,
    });
    //this.props.navigator.replace({ id: 2 });
    this.props.navigation.navigate('Account');
  }

  /*renderSettings() {
    //if (this.props.navigator.getCurrentRoutes().pop().id === 3) return;
    this.setState({
      homeSource: homeUnactivated,
      searchSource: searchUnactivated,
      accountSource: accountUnactivated,
      settingsSource: settingsActivated,
    });
    //this.props.navigator.replace({ id: 3 });
    this.props.navigation.navigate('Settings');
  }*/

  renderCamera() {
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
          onPress={() => this.renderCamera()}
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
