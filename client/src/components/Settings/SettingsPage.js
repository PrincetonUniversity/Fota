import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Header, ImageButton } from '../common';

const radii = [1, 5, 10, 25];

class SettingsPage extends Component {
  renderRadii() {
    console.log('here');
    return radii.map(radius =>
      <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }} key={radius}>
        <Text onPress={radius => } style={{ fontSize: 15, fontFamily: 'Avenir' }}>
          {radius} mi.
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View>
        <Header>
          <Text style={styles.headerTextStyle}>Settings</Text>
        </Header>
        <View>
          <Text style={{ fontSize: 17, fontFamily: 'Avenir' }}>
            Distance Away
          </Text>
          {this.renderRadii()}
        </View>
      </View>
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
  }
};

export default SettingsPage;
