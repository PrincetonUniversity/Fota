import React, { Component } from 'react';
import { Text, View, FlatList, Image, Platform } from 'react-native';
import axios from 'axios';
import firebase from 'firebase';
import { Header, Button, CardSection } from '../common';
import RestaurantModal from '../Restaurant/RestaurantModal';

class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = { uploaded: [], upvoted: [], restaurants: [], deleting: false };
    this.deleting = false;
  }

  componentWillMount() {
    axios.get(`https://fotafood.herokuapp.com/api/user/${this.props.user.uid}`)
      .then(response => this.setState({
        uploaded: response.data.uploadedPhotos,
        upvoted: response.data.likedPhotos
      }));
    axios.get('https://fotafood.herokuapp.com/api/restaurant')
      .then(response => this.setState({ restaurants: response.data }));
  }

  deleteFromServer(photo) {
    if (this.deleting) {
      return;
    }
    this.deleting = true;
    axios.delete('https://fotafood.herokuapp.com/api/photo', { data: { id: photo.id } })
      .then(() => {
        this.deleting = false;
      });
  }

  renderPhoto(photo, allowDelete) {
    let options = null;
    if (allowDelete) {
      options = [{ name: 'Delete', onClick: () => this.deleteFromServer(photo) }];
    }
    const restaurant = this.state.restaurants.filter(
      rest => rest.id === photo.RestaurantId
    )[0];

    return (
      <RestaurantModal
        restaurant={restaurant}
        pageStyle={{ marginTop: (Platform.OS === 'ios') ? 15 : 0 }}
        options={options}
      >
        <Image
          key={photo.id}
          source={{ uri: photo.link }}
          style={styles.photoStyle}
        />
      </RestaurantModal>
    );
  }

  renderPhotoList(list, message, allowDelete) {
    if (list.length === 0) {
      return <Text style={styles.emptyTextStyle}>{message}</Text>;
    }
    return (
      <FlatList
        data={list}
        keyExtractor={photo => photo.id}
        renderItem={photo => this.renderPhoto(photo.item, allowDelete)}
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
        {this.renderPhotoList(this.state.uploaded, 'Take your first photo to see it here!', true)}

        <CardSection>
          <Text style={styles.sectionTextStyle}>My Upvotes</Text>
        </CardSection>
        {this.renderPhotoList(this.state.upvoted, 'See all your upvoted photos here!', false)}

        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <Button onPress={() => firebase.auth().signOut()}>Log out</Button>
        </View>
      </View>
    );
  }
}

const styles = {
  headerTextStyle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontSize: 20,
    color: '#000'
  },
  sectionTextStyle: {
    fontSize: 18,
    fontFamily: 'Avenir'
  },
  emptyTextStyle: {
    color: '#aaa',
    fontFamily: 'Avenir',
    marginHorizontal: 15,
    marginBottom: 10
  },
  photoStyle: {
    height: 80,
    width: 80
  }
};

export default UserPage;
