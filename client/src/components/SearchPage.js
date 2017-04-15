import React, { Component } from 'react';
import { View, ScrollView, ListView } from 'react-native';
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
      <RestaurantListing
        restaurant={restaurant}
      />
    );
  }

  render() {
    const dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.id !== r2.id
        });
    return (
      <View style={{ flex: 1, marginBottom: footerSize }}>
        <Header>
          <Input
            label={require('../img/magnifying_glass_unactivated.png')}
            placeholder='Search'
            value={this.state.query}
            onChangeText={query => this.updateQuery(query)}
          />
       </Header>
       <ScrollView>
         <ListView
           dataSource={dataSource.cloneWithRows(this.state.rlist)}
           renderRow={restaurant => this.renderRestaurant(restaurant)}
           enableEmptySections
         />
         <View style={{ flex: 1, backgroundColor: '#A9A9A9' }} />
      </ScrollView>
     </View>
    );
  }
}

export default SearchPage;
