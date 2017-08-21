import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import { Banner, FilterDisplay } from '../common';

class UploadedPhotos extends Component {
  /*renderPhoto() {
    return <View />;
  }

  render() {
    return (
      <FlatList
        data={this.props.screenProps.uploaded}
        keyExtractor={photo => photo.id}
        renderItem={photo => this.renderRestaurant(photo.item)}
        bounces={false}
        removeClippedSubviews={false}
      />
    );
  }*/
  render() {
    return <Text>Not done yet 3!</Text>;
  }
}

/*const styles = {
  addressStyle: {
    fontFamily: 'Avenir',
    fontSize: 13,
    color: '#aaa'
  },
  titleStyle: {
    fontFamily: 'Avenir',
    fontSize: 15,
    fontWeight: '600',
    color: '#444'
  },
  ratingStyle: {
    fontFamily: 'Avenir',
    fontSize: 15,
    fontWeight: 600,
    color: '#aaa',
    borderColor: '#aaa',
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  
};*/

export default UploadedPhotos;
