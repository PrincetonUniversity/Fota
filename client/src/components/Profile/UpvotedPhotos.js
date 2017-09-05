import React, { Component } from 'react';
import { View, FlatList, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RestaurantModal from '../Restaurant/RestaurantModal';
import { NotFoundText, Spinner } from '../common';
import { dealWithAndroidBeingStupid } from '../common/GradientImage';

const photoSize = (Dimensions.get('window').width - 44) / 3;
const purple = 'red';

class UpvotedPhotos extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused }) => {
      let color = 'rgba(0,0,0,0.21)';
      if (focused) {
        color = '#ff9700';
      }
      return (
        <Icon
          name={'ios-arrow-up'}
          color={color}
          size={45}
        />
      );
    }
  };

  renderPhoto(photo) {
    if (photo.url_small == null) {
      return (
        <RestaurantModal restaurantid={photo.rest_id}>
          <View style={styles.photoFrameStyle}>
            <View style={{ width: photoSize, height: photoSize, borderRadius: 4, backgroundColor: purple }} />
            {dealWithAndroidBeingStupid(4)}
          </View>
        </RestaurantModal>
      );
    }
    return (
      <RestaurantModal restaurantid={photo.rest_id}>
        <View style={styles.photoFrameStyle}>
          <Image
            source={{ uri: photo.url }}
            style={styles.photoStyle}
          />
          {dealWithAndroidBeingStupid(4)}
        </View>
      </RestaurantModal>
    );
  }

  render() {
    if (this.props.screenProps.loading) return <Spinner size='large' />;
    if (this.props.screenProps.upvoted.length === 0) {
      return <NotFoundText text='See all your upvoted photos here.' />;
    }
    return (
      <View style={{ marginHorizontal: 7 }} >
        <FlatList
          data={this.props.screenProps.upvoted}
          keyExtractor={photo => photo.url}
          renderItem={photo => this.renderPhoto(photo.item)}
          bounces={false}
          removeClippedSubviews={false}
          ListHeaderComponent={() => <View style={{ height: 7, backgroundColor: 'white' }} />}
          ListFooterComponent={() => <View style={{ height: 7, backgroundColor: 'white' }} />}
          getItemLayout={(data, index) => (
            { length: photoSize, offset: photoSize * index, index }
          )}
          numColumns={3}
        />
      </View>
    );
  }
}

const styles = {
  photoFrameStyle: {
    margin: 5,
    backgroundColor: 'gray',
    borderRadius: 4,
    overflow: 'hidden',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { height: 1 }
  },
  photoStyle: {
    height: photoSize,
    width: photoSize,
  }
};

export default UpvotedPhotos;
