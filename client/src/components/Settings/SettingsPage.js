import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Header, Button } from '../common';

const SettingsHeader = (props) => (
  <View style={styles.sectionHeaderStyle}>
    <Text style={styles.sectionHeaderTextStyle}>{props.text}</Text>
  </View>
);

class SettingsPage extends Component {
  render() {
    return (
      <View>
        <Header text='Settings'>
          <View style={{ position: 'absolute', left: 10 }}>
            <Ionicon.Button
              name='ios-arrow-back'
              backgroundColor='white'
              color='black'
              size={20}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
        </Header>
      </View>
    );
  }
}

const styles = {
  sectionHeaderStyle: {
    color: 'rgba(0, 0, 0, 0.06)',

  },
};

export default SettingsPage;
