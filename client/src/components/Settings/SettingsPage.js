import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase';
import { Header } from '../common';

export const SettingsHeader = (props) => (
  <View style={styles.sectionHeaderStyle}>
    <Text style={styles.sectionHeaderTextStyle}>{props.text}</Text>
  </View>
);

export const SettingsButton = (props) => (
  <TouchableOpacity onPress={props.onPress} style={styles.buttonStyle}>
    <Text style={styles.buttonTextStyle}>{props.text}</Text>
    {props.children}
  </TouchableOpacity>
);

export const BackButton = (props) => (
  <View style={{ position: 'absolute', left: 10 }}>
    <TouchableOpacity
      style={styles.backButtonStyle}
      onPress={props.onPress}
    >
      <Ionicon
        name='ios-arrow-back'
        backgroundColor='white'
        color='black'
        //onPress={props.onPress}
        size={20}
      />
    </TouchableOpacity>
  </View>
);

class SettingsPage extends Component {
  render() {
    return (
      <View>
        <Header text='Settings'>
          <BackButton onPress={() => this.props.navigation.goBack()} />
        </Header>

        <ScrollView>
          <SettingsHeader text='Location' />
          <SettingsButton
            text='Search Radius'
            onPress={() => this.props.navigation.navigate('Radius')}
          />

          <SettingsHeader text='About' />
          <SettingsButton text='Help &amp; Support' />
          <SettingsButton text='Terms of Service' />
          <SettingsButton text='Privacy Policy' />
          <SettingsButton text='Acknowledgements' />
          <SettingsButton text='Report a Bug' />

          <SettingsHeader text='' />
          <SettingsButton text='Sign out' onPress={() => firebase.auth().signOut()} />
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
    paddingVertical: 5,
    paddingHorizontal: 20
  },
  sectionHeaderTextStyle: {
    color: 'rgba(0, 0, 0, 0.35)',
    fontSize: 13,
    fontWeight: '500'
  },
  backButtonStyle: {
    backgroundColor: 'transparent',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
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
    fontWeight: '500'
  },
};

export default SettingsPage;
