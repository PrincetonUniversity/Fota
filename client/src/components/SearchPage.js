import React, { Component } from 'react';
import { View, FlatList, Image } from 'react-native';
import axios from 'axios';
import { Header, Input } from './common';
import RestaurantListing from './RestaurantListing';
import { footerSize } from './common/Footer';

class SearchPage extends Component {
  state = { query: '', rlist: [], totalList: [] }

  componentWillMount() {
    axios.get('https://fotafood.herokuapp.com/api/restaurant')
      .then(response => this.setState({ totalList: response.data }));
  }

  updateQuery(query) {
    let rlist = [];
    if (query !== '') {
      rlist = this.state.totalList.filter(restaurant =>
        restaurant.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    this.setState({ query, rlist });
  }

  renderRestaurant(restaurant) {
    return (
      <RestaurantListing restaurant={restaurant.item} />
    );
  }

  render() {
    return (
      <View style={{ flex: 1, marginBottom: footerSize }}>
        <Header>
          <Input
            style={styles.containerStyle}
            placeholder='Search'
            value={this.state.query}
            onChangeText={query => this.updateQuery(query)}
          >
            <Image
              style={styles.labelStyle}
              source={require('../img/magnifying_glass_unactivated.png')}
            />
          </Input>
        </Header>
        <View style={{ marginBottom: footerSize }}>
          <FlatList
            data={this.state.rlist}
            keyExtractor={restaurant => restaurant.id}
            renderItem={restaurant => this.renderRestaurant(restaurant)}
            bounces={false}
          />
        </View>
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
    marginHorizontal: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    height: 32
  }
};

export default SearchPage;
