import React, { Component } from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RestaurantModal from '../Restaurant/RestaurantModal';
import { Banner, FilterDisplay, NotFoundText, Spinner } from '../common';
import { dealWithAndroidBeingStupid2 } from '../common/GradientImage';

const itemWidth = Dimensions.get('window').width / 2 - 40;
const PHOTO_BORDER_RADIUS = 7;

class BookmarkedRestaurants extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused }) => {
      let color = 'rgba(0,0,0,0.21)';
      if (focused) {
        color = '#ff9700';  
      }
      return (
        <Icon
          name={'ios-bookmark'}
          color={color}
          size={30}
        />
      );
    }
  };

  renderFilters(rest) {
    if (rest.categories[0]) {
      return (
        <FilterDisplay
          text={rest.categories[0].title}
          color='rgba(0, 0, 0, 0.6)'
          size={10}
          numberOfLines={1}
          ellipsizeMode='tail'
        />
      );
    }
  }

  renderRestaurant(rest) {
    //const street = rest.location.display_address[0].replace(/^[0-9]* /, '');
    //const address = `${street}, ${rest.location.city}`;
    const voteCount = rest.recommend_yes_count + rest.recommend_no_count;
    let rating = '--';
    if (voteCount !== 0) {
      rating = `${Math.round(rest.recommend_yes_count / voteCount * 100)}%`;
    }
    return (
      <RestaurantModal restaurantid={rest.id}>
        <View style={styles.cardStyle}>
          <View style={{ borderRadius: PHOTO_BORDER_RADIUS, overflow: 'hidden', flex: 1 }}>
            <Banner
              photo={rest.bannerUrl}
              containerStyle={{ height: 75 }}
              photoStyle={{ flex: 1 }}
            />
            <View style={{ marginHorizontal: 15, marginVertical: 10, flex: 1, justifyContent: 'space-between' }}>
              <View>
                {/* <Text style={styles.addressStyle} numberOfLines={1} ellipsizeMode='tail'>{address}</Text> */}
                <Text style={styles.titleStyle}>{rest.name}</Text>
              </View>
              <View style={styles.ratingContainerStyle}>
                <Text style={styles.ratingTextStyle}>{rating}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                {/* {this.renderFilters(rest)} */}
              </View>
            </View>
          </View>
          {dealWithAndroidBeingStupid2(PHOTO_BORDER_RADIUS)}
        </View>
      </RestaurantModal>
    );
  }

  render() {
    if (this.props.screenProps.loading) return <Spinner size='large' />;    
    if (this.props.screenProps.bookmarked.length === 0) {
      return <NotFoundText text='See all your bookmarked restaurants here.' />;
    }
    return (
      <View style={{ marginHorizontal: 20 }}>
        <FlatList
          data={this.props.screenProps.bookmarked}
          keyExtractor={rest => rest.id}
          renderItem={rest => this.renderRestaurant(rest.item)}
          ListHeaderComponent={() => <View style={{ height: 10, backgroundColor: 'white' }} />}
          ListFooterComponent={() => <View style={{ height: 10, backgroundColor: 'white' }} />}
          removeClippedSubviews={false}
          onRefresh={this.props.screenProps.refreshPage}
          refreshing={this.props.screenProps.refreshing}
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
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderRadius: PHOTO_BORDER_RADIUS,
    flex: 1
  },
  addressStyle: {
    fontSize: 11,
    fontWeight: '300',
    color: 'rgba(0, 0, 0, 0.61)'
  },
  titleStyle: {
    fontSize: 14,
    fontWeight: '900',
    color: 'rgba(0, 0, 0, 0.75)',
    marginVertical: 7
  },
  ratingContainerStyle: {
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 6,
    marginBottom: 7,
    width: 60
  },
  ratingTextStyle: {
    fontSize: 14,
    fontWeight: '900',
    color: 'rgba(0, 0, 0, 0.6)',
  }
};

export default BookmarkedRestaurants;
