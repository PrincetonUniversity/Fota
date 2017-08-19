import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { Banner } from '../common';

class BookmarkedRestaurants extends Component {
  renderRestaurant(rest) {
    return (
      <Card>
        <Banner
          photo={this.state.photos === undefined ? undefined : rest.photos[0].url}
          containerStyle={{ height: 50 }}
          photoStyle={{ flex: 1 }}
        />
      </Card>
    );
  }

  render() {
    return (
      <FlatList
        data={this.props.screenProps.bookmarked}
        keyExtractor={rest => rest.id}
        renderItem={rest => this.renderRestaurant(rest)}
        bounces={false}
        removeClippedSubviews={false}
        numColumns={2}
      />
    );
  }
}

export default BookmarkedRestaurants;