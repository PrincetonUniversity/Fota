import React, { Component } from 'react';
import { Text, View, AsyncStorage, TouchableHighlight, Image, FlatList } from 'react-native';
import { Header } from '../common';

const radii = [1, 5, 10, 25];
const checkmark = require('../../img/fota_home_activated.png');

class SettingsPage extends Component {
  state = { radius: '', fetchingComplete: false }

  componentWillMount() {
    AsyncStorage.getItem('SearchRadius').then(currentRadius =>
      this.setState({ radius: parseInt(currentRadius, 10), fetchingComplete: true })
    );
  }

  componentDidUpdate() {
    AsyncStorage.getItem('SearchRadius').then(currentRadius =>
      this.setState({ radius: parseInt(currentRadius, 10) })
    );
  }

  renderCheckmark(radius) {
    if (radius === this.state.radius) {
      return (
        <Image
          source={checkmark}
          style={{ width: 15, height: 15 }}
        />
      );
    }
    return;
  }

  renderRadius(radius) {
    return (
      <TouchableHighlight
        key={radius}
        onPress={() => {
          this.setState({ radius });
          AsyncStorage.setItem('SearchRadius', radius.toString());
        }}
      >
        <View style={styles.distanceStyle}>
          <Text style={{ fontSize: 15, fontFamily: 'Avenir' }}>
            {radius} mi.
          </Text>
          {this.renderCheckmark(radius)}
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    if (this.state.fetchingComplete) {
      return (
        <View>
          <Header>
            <Text style={styles.headerTextStyle}>Settings</Text>
          </Header>
          <View>
            <Text style={{ fontSize: 17, fontFamily: 'Avenir' }}>
              Distance Away
            </Text>
            <FlatList
              data={radii}
              keyExtractor={index => index}
              renderItem={radius => this.renderRadius(radius.item)}
            />
          </View>
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
    fontFamily: 'Avenir',
    fontSize: 20,
    color: '#000'
  },
  distanceStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5
  }
};

export default SettingsPage;
