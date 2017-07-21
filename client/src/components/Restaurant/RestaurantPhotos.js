import React, { Component } from 'react';
import { View, Image, Text, FlatList } from 'react-native';
import request from '../../helpers/axioshelper';

const restaurantDetails = 'https://fotafood.herokuapp.com/api/restaurant/';

class RestaurantPhotos extends Component {
  static navigationOptions = {
    tabBarLabel: 'Photos'
  };

  state = { photos: [], loading: true }

  componentWillMount() {
    request.get(restaurantDetails + this.props.screenProps.restaurant.id)
    .then(response => this.setState({
      photos: response.data,
      loading: false,
    })).catch(e => request.showErrorAlert(e));
  }

  renderPhoto(photo) {
    return (
      <View key={photo.id} style={{ marginVertical: 5, marginHorizontal: 5 }}>
        <View style={{ shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { height: 1 } }}>
          <Image
            source={{ uri: photo.link }}
            style={styles.photoStyle}
          />
        </View>
      </View>
    );
  }

  render() {
    if (!this.state.loading && this.state.photos.length === 0) {
      return (
        <View style={{ height: 150, justifyContent: 'center' }}>
          <Text style={styles.emptyTextStyle}>
            Be the first to upload a photo here!
          </Text>
        </View>

      );
    }
    return (
      <View style={{ flex: 1, alignItems: 'center', paddingTop: 5 }}>
        <FlatList
          data={this.state.photos}
          keyExtractor={photo => photo.id}
          renderItem={photo => this.renderPhoto(photo.item)}
          showsHorizontalScrollIndicator={false}
          numColumns={3}
          removeClippedSubviews={false}
        />
      </View>
    );
  }
}

const styles = {
  emptyTextStyle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#aaa',
    fontFamily: 'Avenir',
  },
  photoStyle: { // Individual photos
    height: 110,
    width: 110,
    borderRadius: 4
  }
};

export default RestaurantPhotos;
