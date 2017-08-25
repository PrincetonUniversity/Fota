import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Header } from '../common';

const SettingsHeader = (props) => (
  <View style={styles.sectionHeaderStyle}>
    <Text style={styles.sectionHeaderTextStyle}>{props.text}</Text>
  </View>
);

const SettingsButton = (props) => (
  <TouchableOpacity onPress={props.onPress} style={styles.buttonStyle}>
    <Text style={styles.buttonTextStyle}>{props.text}</Text>
  </TouchableOpacity>
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

        <ScrollView>
          <SettingsHeader text='Location' />
          <SettingsButton text='Search Radius' />
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  sectionHeaderStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    borderColor: 'rgba(0, 0, 0, 0.09)',
    borderBottomWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 20
  },
  sectionHeaderTextStyle: {
    color: 'rgba(0, 0, 0, 0.35)',
    fontSize: 13,
    fontWeight: '500',
  },
  buttonStyle: {
    borderColor: 'rgba(0, 0, 0, 0.09)',
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  buttonTextStyle: {
    color: 'rgba(0, 0, 0, 0.55)',
    fontSize: 15,
    fontWeight: '500',
  },
};

export default SettingsPage;
