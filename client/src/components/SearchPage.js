import React, { Component } from 'react';
import { Header, Input } from './common';

class SearchPage extends Component {
  state = { query: '' }

  render() {
    return (
      <Header>
        <Input
          label={require('../img/magnifying_glass_unactivated.png')}
          placeholder='Search'
          value={this.state.query}
          onChangeText={query => this.setState({ query })}
        />
     </Header>
    );
  }
}

export default SearchPage;
