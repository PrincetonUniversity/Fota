import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView, Dimensions } from 'react-native';
import { Banner, FilterDisplay } from '../common';
import RestaurantModal from '../Restaurant/RestaurantModal'

const itemWidth = Dimensions.get('window').width / 2 - 40;

class BookmarkedRestaurants extends Component {
  renderFilters(rest) {
    return rest.categories.map((filterName, index) =>
      <FilterDisplay
        key={index}
        text={filterName.title}
        color='#ccc'
      />
    );
  }

  renderRestaurant(rest) {
    const street = rest.location.display_address[0].replace(/^[0-9]* /, '');
    const address = `${street}, ${rest.location.city}`;
    return (
      <RestaurantModal restaurantid={rest.id}>
        <View style={styles.cardStyle}>
          <Banner
            photo={rest.photos === undefined ? undefined : rest.photos[0].url}
            containerStyle={{ height: 75 }}
            photoStyle={{ flex: 1 }}
          />
          <View style={{ margin: 10 }}>
            <Text style={styles.addressStyle}>{address}</Text>
            <Text style={styles.titleStyle}>{rest.name}</Text>
            <Text style={styles.ratingStyle}>96%</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {this.renderFilters(rest)}
            </View>
          </View>
        </View>
      </RestaurantModal>
    );
  }

  render() {
    return (
      <View style={{ marginHorizontal: 20 }}>
        <FlatList
          data={this.props.screenProps.bookmarked}
          keyExtractor={rest => rest.id}
          renderItem={rest => this.renderRestaurant(rest.item)}
          bounces={false}
          removeClippedSubviews={false}
          numColumns={2}
        />
      </View>
    );
  }
}

const styles = {
  cardStyle: {
    margin: 10,
    width: itemWidth,
    elevation: 2,
    borderRadius: 7
  },
  addressStyle: {
    fontFamily: 'Avenir',
    fontSize: 12,
    color: '#aaa'
  },
  titleStyle: {
    fontFamily: 'Avenir',
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginVertical: 7
  },
  ratingStyle: {
    fontFamily: 'Avenir',
    fontSize: 16,
    fontWeight: '500',
    color: '#aaa',
    borderColor: '#ddd',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 7,
    marginBottom: 7,
    width: 60
  }
};

export default BookmarkedRestaurants;
