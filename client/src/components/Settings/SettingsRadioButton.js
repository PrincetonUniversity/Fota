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
import { View, AsyncStorage, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Header } from '../common';
import { SettingsButton, BackButton } from './SettingsPage';

class SettingsRadioButton extends Component {
  state = { selected: '' }

  componentWillMount() {
    AsyncStorage.getItem(this.props.name).then(item =>
      this.setState({ selected: item })
    );
  }

  updateItem(item) {
    AsyncStorage.setItem(this.props.name, item).then(() => {
      this.setState({ selected: item });
    });
  }

  renderCheck(item) {
    if (item === this.state.selected) {
      return (
        <View style={styles.checkStyle}>
          <Icon name='check' color='#ff9700' size={20} />
        </View>
      );
    }
  }

  renderItem(item) {
    return (
      <View>
        <SettingsButton 
          text={`${item}${this.props.extraText}`}
          onPress={() => this.updateItem(item)}
        />
        {this.renderCheck(item)}
      </View> 
    );
  }

  render() {
    if (this.state.selected) {
      return (
        <View>
          <Header text={this.props.title}>
            <BackButton onPress={() => this.props.navigation.goBack()} />
          </Header>
          <FlatList
            data={this.props.options}
            extraData={this.state.selected}
            keyExtractor={item => item.toString()}
            renderItem={item => this.renderItem(item.item)}
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
  },
  checkStyle: {
    position: 'absolute',
    justifyContent: 'center',
    right: 20,
    top: 0,
    bottom: 0,
  }
};

export default SettingsRadioButton;
