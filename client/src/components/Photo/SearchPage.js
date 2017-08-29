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
import { Text, View, ScrollView, Platform, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { ListItem, Separator } from 'native-base';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import request from '../../helpers/axioshelper';
import { searchRequest } from '../../helpers/URL';
import { Input } from '../common';
import RestaurantModal from '../Restaurant/RestaurantModal';
import { pcoords } from '../../Base';
import icoMoonConfig from '../../selection.json';

const Icon = createIconSetFromIcoMoon(icoMoonConfig);

class SearchPage extends Component {
  state = { lat: pcoords.lat, lng: pcoords.lng, query: '', restaurants: [], categories: [] }

  componentWillMount() {
    if (!this.props.browsingPrinceton) {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    }
  }

  updateQuery(query) {
    this.setState({ query, restaurants: [], categories: [] });    
    if (query) {
      request.get(searchRequest(this.state.lat, this.state.lng, query))
      .then(response => {
        this.setState({
          restaurants: response.data.restaurants,
          categories: response.data.categories
        });
      })
      .catch(e => request.showErrorAlert(e));
    }
  }

  renderFilterHeader() {
    if (this.state.query && this.state.categories.length > 0) {
      return (
        <Separator bordered>
          <Text style={styles.resultHeaderStyle}>Filters</Text>
        </Separator>
      );
    }
  }

  renderFilter(filter) {
    return (
        <ListItem key={filter} onPress={() => this.props.selectFilter(filter)}>
          <Text style={styles.searchResultStyle}>{filter}</Text>
        </ListItem>
    );
  }

  renderFilters() {
    if (this.state.query && this.state.categories.length > 0) {
      return this.state.categories.map(category =>
        this.renderFilter(category.category)
      );
    }
    // return (
    //   <View>
    //     <FlatList
    //       data={filters}
    //       keyExtractor={(filter, index) => index}
    //       renderItem={filter => this.renderFilter(filter.item)}
    //       ListHeaderComponent={() => this.renderFilterHeader()}
    //       keyboardShouldPersistTaps={'handled'}
    //       bounces={false}
    //       removeClippedSubviews={false}
    //       //extraData={[this.state.terms, this.state.categories]}
    //     />
    //   </View>
    // );
  }

  renderRestaurantHeader() {
    if (this.state.query && this.state.restaurants.length > 0) {
      return (
        <Separator bordered>
          <Text style={styles.resultHeaderStyle}>Restaurants</Text>
        </Separator>
      );
    }
  }

  renderRestaurant(restaurant) {
    return (
      <RestaurantModal key={restaurant.id} restaurantid={restaurant.id}>
        <ListItem>
          <Text style={styles.searchResultStyle}>{restaurant.name}</Text>
        </ListItem>
      </RestaurantModal>
    );
  }

  renderRestaurants() {
    if (this.state.query && this.state.restaurants.length > 0) {
      return this.state.restaurants.map(restaurant =>
        this.renderRestaurant(restaurant)
      );
    }
    // return (
    //   <FlatList
    //     data={this.state.restaurants}
    //     keyExtractor={(restaurant, index) => index}
    //     renderItem={restaurant => this.renderRestaurant(restaurant.item)}
    //     ListHeaderComponent={() => this.renderRestaurantHeader()}
    //     keyboardShouldPersistTaps={'handled'}
    //     bounces={false}
    //     removeClippedSubviews={false}
    //   />
    // );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={styles.headerStyle}>
          <View style={styles.searchContainerStyle}>
            <Input
              style={styles.searchBarStyle}
              placeholder='Search'
              autoFocus
              value={this.state.query}
              onChangeText={query => this.updateQuery(query)}
            >
              <Icon
                name='search'
                color='rgba(0,0,0,0.34)'
                backgroundColor='transparent'
                underlayColor='transparent'
                size={19}
                style={{ marginLeft: 12 }}
              />
            </Input>
            <Text style={styles.cancelStyle} onPress={this.props.onCancel}>Cancel</Text>
          </View>
        </View>
        <ScrollView keyboardShouldPersistTaps='handled' onScroll={Keyboard.dismiss}>
          {this.renderFilterHeader()}
          {this.renderFilters()}
          {this.renderRestaurantHeader()}
          {this.renderRestaurants()}
        </ScrollView>
        {/* {this.renderFilters()}
        {this.renderRestaurants()} */}
      </View>
    );
  }
}

const styles = {
  headerStyle: {
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: 60,
    marginTop: Platform.OS === 'ios' ? 15 : 0,
    position: 'relative',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.09)',
  },
  searchContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginRight: 25
  },
  searchBarStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    marginLeft: 25,
    marginRight: 15,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 10
  },
  cancelStyle: {
    fontSize: 15,
    fontWeight: '300',
    color: 'rgba(0,0,0,0.38)'
  },
  resultHeaderStyle: {
    fontSize: 13,
    fontWeight: '300',
    color: 'rgba(0,0,0,0.55)'
  },
  searchResultStyle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.7)'
  }
};

function mapStateToProps({ browsingPrinceton }) {
  return { browsingPrinceton };
}

export default connect(mapStateToProps)(SearchPage);
