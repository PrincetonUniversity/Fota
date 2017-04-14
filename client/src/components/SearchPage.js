import React, { Component } from 'react';
import { Text, View, ListView } from 'react-native';
import axios from 'axios';
import { Header, Input, CardSection } from './common';

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
      <CardSection>
        <Text>{restaurant.name}</Text>
      </CardSection>
    );
  }

  render() {
    const dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.id !== r2.id
        });
    return (
      <View>
        <Header>
          <Input
            label={require('../img/magnifying_glass_unactivated.png')}
            placeholder='Search'
            value={this.state.query}
            onChangeText={query => this.updateQuery(query)}
          />
       </Header>
       <ListView
         dataSource={dataSource.cloneWithRows(this.state.rlist)}
         renderRow={restaurant => this.renderRestaurant(restaurant)}
         enableEmptySections
       />
     </View>
    );
  }
}

export default SearchPage;
