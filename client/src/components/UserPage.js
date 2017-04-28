import React, { Component } from 'react';
import { Text, View, FlatList, Image } from 'react-native';
import axios from 'axios';
import firebase from 'firebase';
import { Header, Button, CardSection } from './common';
import RestaurantModal from './RestaurantModal';

class UserPage extends Component {
  state = { uploaded: [], upvoted: [], restaurants: [] }

  componentWillMount() {
    axios.get(`https://fotafood.herokuapp.com/api/user/${this.props.user.uid}`)
      .then(response => this.setState({
        uploaded: response.data.uploadedPhotos,
        upvoted: response.data.likedPhotos
      }));
    axios.get('https://fotafood.herokuapp.com/api/restaurant')
      .then(response => this.setState({ restaurants: response.data }));
  }

  renderPhoto(photo) {
    const restaurant = this.state.restaurants.filter(
      rest => rest.id === photo.RestaurantId
    )[0];
    return (
      <RestaurantModal restaurant={restaurant}>
        <Image
          key={photo.id}
          source={{ uri: photo.link }}
          style={styles.photoStyle}
        />
      </RestaurantModal>
    );
  }

  renderPhotoList(list, message) {
    if (list.length === 0) {
      return <Text style={styles.emptyTextStyle}>{message}</Text>;
    }
    return (
      <FlatList
        data={list}
        keyExtractor={photo => photo.id}
        renderItem={photo => this.renderPhoto(photo.item)}
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 10 }}
        horizontal
      />
    );
  }

  render() {
    return (
      <View>
        <Header><Text style={styles.headerTextStyle}>{this.props.user.email}</Text></Header>

        <CardSection>
          <Text style={styles.sectionTextStyle}>My Photos</Text>
        </CardSection>
        {this.renderPhotoList(this.state.uploaded, 'Upload a photo to see it here!')}

        <CardSection>
          <Text style={styles.sectionTextStyle}>My Upvotes</Text>
        </CardSection>
        {this.renderPhotoList(this.state.upvoted, 'Save all your upvoted photos here!')}

        <View style={{ alignItems: 'center' }}>
          <Button onPress={() => firebase.auth().signOut()}>Log out</Button>
        </View>
      </View>
    );
  }
}

const styles = {
  headerTextStyle: {
    fontSize: 20,
    color: '#000'
  },
  sectionTextStyle: {
    fontSize: 18,
    fontFamily: 'Avenir'
  },
  emptyTextStyle: {
    color: '#aaa',
    marginHorizontal: 15,
    marginBottom: 10
  },
  photoStyle: {
    height: 80,
    width: 80
  }
};

export default UserPage;
