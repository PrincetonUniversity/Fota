import React, { Component } from 'react';
import { View } from 'react-native';
import { Header, Input } from './common';

class SearchPage extends Component {
  state = { query: '', rlist: [], totalList: [] }

  renderSearchResults() {
    this.state.query
  }

  render() {
    return (
      <View>
        <Header>
          <Input
            label={require('../img/magnifying_glass_unactivated.png')}
            placeholder='Search'
            value={this.state.query}
            onChangeText={query => this.setState({ query })}
          />
       </Header>
       {this.renderSearchResults()}
     </View>
    );
  }
}

export default SearchPage;
