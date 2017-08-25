/******************************************************************************
 * Called by: Base
 * Dependencies: common/Header
 *
 * Description: Settings page accessed through the bottom navigation bar.
 * Allows the user to select from different options for search radius
 * (Photo/PhotoList), and stores it in async storage.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { Text, View, AsyncStorage, TouchableHighlight, Image, FlatList } from 'react-native';
import { Header } from '../common';

const radii = ['1', '3', '5', '10'];
const checkmark = require('../../img/fota_home_activated.png');
const homeUnactivated = require('../../img/fota_home_unactivated.png');

class SettingsPage extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={homeUnactivated}
        style={{ width: 26, height: 26, tintColor }}
      />
    ),
  };

  state = { radius: '' }

  componentWillMount() {
    AsyncStorage.getItem('SearchRadius').then(currentRadius =>
      this.setState({ radius: currentRadius })
    );
  }

  updateRadius(radius) {
    this.setState({ radius });
  }

  renderCheckmark(radius) {
    if (radius === this.state.radius) {
      return (
        <Image
          source={checkmark}
          style={{ width: 20, height: 20 }}
        />
      );
    }
  }

  renderRadius(radius) {
    return (
      <TouchableHighlight
        key={radius}
        underlayColor='#ff9700'
        onPress={() => {
          AsyncStorage.setItem('SearchRadius', radius).then(() =>
            this.updateRadius(radius)
          );
        }}
      >
        <View style={styles.distanceStyle}>
          <Text style={{ fontSize: 17, marginLeft: 5 }}>
            {radius} mi.
          </Text>
          {this.renderCheckmark(radius)}
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    if (this.state.radius) {
      return (
        <View>
          <Header>
            <Text style={styles.headerTextStyle}>Settings</Text>
          </Header>
          <Text style={{ fontSize: 23, marginLeft: 5 }}>
            Distance
          </Text>
          <FlatList
            data={radii}
            extraData={this.state.radius}
            keyExtractor={index => (index + this.state.radius)}
            renderItem={radius => this.renderRadius(radius.item)}
            ListHeaderComponent={() =>
              <View style={{ height: 1, backgroundColor: 'gray' }} />
            }
            ItemSeparatorComponent={() =>
              <View style={{ height: 1, backgroundColor: 'gray' }} />
            }
            ListFooterComponent={() =>
              <View style={{ height: 1, backgroundColor: 'gray' }} />
            }
            bounces={false}
            removeClippedSubviews={false}
          />
        </View>
      );
    }
    return (
      <View />
    );
  }
}

const styles = {
  headerTextStyle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 30,
    color: '#000'
  },
  distanceStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10
  }
};

export default SettingsPage;
