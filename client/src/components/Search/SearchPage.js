/******************************************************************************
 * Called by: Base
 * Dependencies: helper/axioshelper, common/Header, common/Input,
 * Restaurant/RestaurantModal
 *
 * Description: Displays the search page. Finds the list of all nearby
 * restaurants (not affected by search distance set), then filters the
 * restaurants based on the search query (name only). Tapping on the name of
 * the restaurant displays the restaurant page.
 *
 * Bugs: Uploading a comment in the restaurant page by accessing it through
 * the search page doesn't allow tap-to-enter-comment due to
 * keyboardShouldPersistTaps functionality (in FlatList)
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { Text, View, FlatList, Image, Platform } from 'react-native';
import request from '../../helpers/axioshelper';
import { Header, Input } from '../common';
import RestaurantModal from '../Restaurant/RestaurantModal';

const homeUnactivated = require('../../img/fota_home_unactivated.png');

class SearchPage extends Component {
  state = { query: '', rlist: [], totalList: [] }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={homeUnactivated}
        style={{ width: 26, height: 26, tintColor }}
      />
    ),
  };

  componentWillMount() {
    request.get('https://fotafood.herokuapp.com/api/restaurant')
      .then(response => this.setState({ totalList: response.data }))
      .catch(e => request.showErrorAlert(e));
  }

  updateQuery(query) {
    let rlist = this.state.totalList;
    const qarr = query.toLowerCase().split(' ');
    if (qarr.length === 0 || qarr[0] === '') {
      this.setState({ query, rlist: [] });
      return;
    }
    const current = qarr.pop();
    for (const qword of qarr) {
      rlist = rlist.filter(restaurant => {
        const arr = restaurant.name.toLowerCase().split(' ');
        for (const word of arr) {
          if (word === qword) return true;
        }
        return false;
      });
    }
    rlist = rlist.filter(restaurant => {
      const arr = restaurant.name.toLowerCase().split(' ');
      for (const word of arr) {
        if (word.startsWith(current)) return true;
      }
      return false;
    });
    this.setState({ query, rlist });
  }

  renderRestaurant(restaurant) {
    return (
      <RestaurantModal
        restaurant={restaurant}
        pageStyle={{ paddingTop: (Platform.OS === 'ios') ? 15 : 0 }}
      >
        <View style={{ flexDirection: 'row', padding: 10 }}>
          <Text style={{ fontFamily: 'Avenir', fontSize: 15 }}>
            {restaurant.name}
          </Text>
        </View>
      </RestaurantModal>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header>
          <Input
            style={styles.containerStyle}
            placeholder='Search for a restaurant'
            value={this.state.query}
            onChangeText={query => this.updateQuery(query)}
          >
            <Image
              style={styles.labelStyle}
              source={require('../../img/magnifying_glass_unactivated.png')}
            />
          </Input>
        </Header>
        <FlatList
          data={this.state.rlist}
          keyExtractor={restaurant => restaurant.id}
          renderItem={restaurant => this.renderRestaurant(restaurant.item)}
          keyboardShouldPersistTaps={'handled'}
          bounces={false}
          removeClippedSubviews={false}
        />
      </View>
    );
  }
}

const styles = {
  labelStyle: {
    width: 15,
    height: 15,
    marginRight: 5
  },
  containerStyle: {
    backgroundColor: '#ddd',
    paddingHorizontal: 12,
    borderRadius: 16,
    height: 32
  },
  dismisserStyle: {
    flex: 1,
    color: '#f00'
  }
};

export default SearchPage;
