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
import { ListItem, Separator } from 'native-base';
import request from '../../helpers/axioshelper';
import { searchRequest } from '../../helpers/URL';
import { Header, Input } from '../common';
import RestaurantModal from '../Restaurant/RestaurantModal';

const homeUnactivated = require('../../img/fota_home_unactivated.png');

class SearchPage extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={homeUnactivated}
        style={{ width: 26, height: 26, tintColor }}
      />
    ),
  };

  state = { query: '', terms: [], businesses: [], categories: [] }

  componentWillMount() {
    // request.get('https://fotafood.herokuapp.com/api/restaurant')
    //   .then(response => this.setState({ totalList: response.data }))
    //   .catch(e => request.showErrorAlert(e));
  }

  // updateQuery(query) {
  //   let rlist = this.state.totalList;
  //   const qarr = query.toLowerCase().split(' ');
  //   if (qarr.length === 0 || qarr[0] === '') {
  //     this.setState({ query, rlist: [] });
  //     return;
  //   }
  //   const current = qarr.pop();
  //   for (const qword of qarr) {
  //     rlist = rlist.filter(restaurant => {
  //       const arr = restaurant.name.toLowerCase().split(' ');
  //       for (const word of arr) {
  //         if (word === qword) return true;
  //       }
  //       return false;
  //     });
  //   }
  //   rlist = rlist.filter(restaurant => {
  //     const arr = restaurant.name.toLowerCase().split(' ');
  //     for (const word of arr) {
  //       if (word.startsWith(current)) return true;
  //     }
  //     return false;
  //   });
  //   this.setState({ query, rlist });
  // }
  updateQuery(query) {
//    if (this.state.query.length !== 0) {
//      try {
//        request.cancel();
//      } catch (e) {
//        console.log(e);
//      }
//    }
    if (query === '') {
      this.setState({ query: '' });
    } else {
      this.setState({ query, terms: [], businesses: [], categories: [] });
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        request.get(searchRequest(lat, lng, query))
          .then(response => {
            this.setState({
              terms: response.data.terms,
              businesses: response.data.businesses,
              categories: response.data.categories
              //query
            });
          })
          .catch(e => request.showErrorAlert(e));
      });
    }
  }

  renderFilterHeader() {
    return (
      <Separator bordered>
        <Text>Filters</Text>
      </Separator>
    );
  }

  renderFilter(filter) {
    return (
      <ListItem style={{ }}>
        <Text style={{ fontSize: 12 }}>{filter}</Text>
      </ListItem>
    );
  }

  renderFilters() {
    if (this.state.terms.length + this.state.categories.length === 0) {
      return <View />;
    }
    const termText = this.state.terms.map(term => term.text);
    const categoryTitles = this.state.categories.map(category => category.title);
    const filters = termText.concat(categoryTitles);
    //console.log(filters);
    return (
      <View>
        <FlatList
          data={filters}
          keyExtractor={(filter, index) => index}
          renderItem={filter => this.renderFilter(filter.item)}
          ListHeaderComponent={() => this.renderFilterHeader()}
          keyboardShouldPersistTaps={'handled'}
          bounces={false}
          removeClippedSubviews={false}
          extraData={[this.state.terms, this.state.categories]}
        />
      </View>
    );
  }

  renderBusinessHeader() {
    return (
      <Separator bordered>
        <Text>Restaurants</Text>
      </Separator>
    );
  }

  renderBusiness(business) {
    //console.log(business.name);
    return (
      <ListItem>
        <Text style={{ fontSize: 12 }}>{business.name}</Text>
      </ListItem>
    );
  }

  renderBusinesses() {
    if (this.state.businesses.length === 0) {
      return <View />;
    }
    return (
      <FlatList
        data={this.state.businesses}
        keyExtractor={(business, index) => index}
        renderItem={business => this.renderBusiness(business.item)}
        ListHeaderComponent={() => this.renderBusinessHeader()}
        keyboardShouldPersistTaps={'handled'}
        bounces={false}
        removeClippedSubviews={false}
      />
    );
  }

  // renderRestaurant(restaurant) {
  //   return (
  //     <RestaurantModal
  //       restaurant={restaurant}
  //       pageStyle={{ paddingTop: (Platform.OS === 'ios') ? 15 : 0 }}
  //     >
  //       <View style={{ flexDirection: 'row', padding: 10 }}>
  //         <Text style={{ fontSize: 15 }}>
  //           {restaurant.name}
  //         </Text>
  //       </View>
  //     </RestaurantModal>
  //   );
  // }

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
        {this.renderFilters()}
        {this.renderBusinesses()}
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
