import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  FlatList,
  AsyncStorage,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import request from '../../helpers/axioshelper';
import { Input, Header } from '../common';
import { deleteImage } from './CameraPage';

const styles = {
  pageStyle: {
    flex: 1,
    flexDirection: 'column'
  },
  headerTextStyle: {
    fontSize: 15,
    fontFamily: 'Avenir'
  },
  imageStyle: {
    width: 150,
    height: 150,
    marginBottom: 10
  },
  containerStyle: {
    backgroundColor: '#ddd',
    marginHorizontal: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderRadius: 16,
    height: 32
  }
};

const { pageStyle,
        headerTextStyle,
        imageStyle,
        containerStyle
      } = styles;

class CameraLocationPage extends Component {
  state = { uploadPath: null, query: '', rlist: [], totalList: [] }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      request.get(`https://fotafood.herokuapp.com/api/restaurantnear?lat=${lat}&lng=${lng}`)
        .then(response => this.setState({ totalList: response.data, rlist: response.data }))
        .catch(e => request.showErrorAlert(e));
    });
  }

  componentDidMount() {
    AsyncStorage.getItem('UploadPath').then((path) => {
      this.setState({ uploadPath: path });
    }).done();
  }

  updateQuery(query) {
    let rlist = this.state.totalList;
    const qarr = query.toLowerCase().split(' ');
    if (qarr.length === 0 || qarr[0] === '') {
      this.setState({ query, rlist: [] });
      return;
    }
    const current = qarr.pop();
    for (const qword of qarr) {
      rlist = rlist.filter(restaurant => {
        const arr = restaurant.name.toLowerCase().split(' ');
        for (const word of arr) {
          if (word === qword) return true;
        }
        return false;
      });
    }
    rlist = rlist.filter(restaurant => {
      const arr = restaurant.name.toLowerCase().split(' ');
      for (const word of arr) {
        if (word.startsWith(current)) return true;
      }
      return false;
    });
    this.setState({ query, rlist });
  }

  renderRestaurant(restaurant) {
    return (
      <TouchableOpacity
        onPress={() => {
          AsyncStorage.setItem('UploadRestaurant', String(restaurant.id));
          this.renderCameraComments();
        }}
      >
        <View style={{ flexDirection: 'row', padding: 10 }}>
          <Text style={{ fontFamily: 'Avenir', fontSize: 15 }}>
            {restaurant.name}
          </Text>
          <View style={{ flex: 1 }} />
          <Text style={{ fontFamily: 'Avenir', fontSize: 10 }}>
            {restaurant.distance.toPrecision(2)} mi.
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderCameraPage() {
    this.props.navigator.replace({ id: 0 });
  }

  renderCameraComments() {
    console.log(this.props.navigator);
    this.props.navigator.replace({ id: 2 });
  }

  render() {
    if (this.state.uploadPath) {
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={pageStyle}>
            <Header>
              <Text
                style={headerTextStyle}
                onPress={() => {
                  deleteImage(this.state.uploadPath);
                  AsyncStorage.setItem('UploadPath', '');
                  this.renderCameraPage();
                }}
              >
                Cancel
              </Text>
            </Header>

            <View style={{ alignItems: 'center' }}>
              <Image
                source={{ uri: this.state.uploadPath }}
                style={imageStyle}
              />
            </View>

            <Header>
              <Input
                style={containerStyle}
                placeholder='Where are you?'
                value={this.state.query}
                onChangeText={query => this.updateQuery(query)}
              />
            </Header>

            <FlatList
              data={this.state.rlist}
              keyExtractor={restaurant => restaurant.id}
              renderItem={restaurant => this.renderRestaurant(restaurant.item)}
              keyboardShouldPersistTaps={'handled'}
              bounces={false}
              removeClippedSubviews={false}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return ( // DO SOMETHING HERE
      <View style={{ flex: 1, backgroundColor: 'white' }} />
    );
  }
}

export default CameraLocationPage;
