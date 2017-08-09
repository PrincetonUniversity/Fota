/******************************************************************************
 * Called by: ./CameraNavigator
 * Dependencies: request, common/Button, common/Header, ./CameraPage/deleteImage
 *
 * Description: Step 2 of 3 in uploading a photo. Presents options for
 * selecting a restaurant to be associated with the picture. Users can retake
 * the picture (Camera/CameraPage), deleting the current picture from local temp
 * storage, or after choosing a restaurant can proceed to the comments page
 * (Camera/CameraCommentsPage).
 *
 ******************************************************************************/

import React, { Component } from 'react';
import {
  View, Image, Text, FlatList, AsyncStorage, TouchableWithoutFeedback,
  Keyboard, TouchableOpacity, Dimensions, TextInput
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { NavigationActions } from 'react-navigation';
import request from '../../helpers/axioshelper';
import { Header, Button } from '../common';
import { deleteImage } from './CameraPage';

class CameraLocationPage extends Component {
  state = { uploadPath: null, query: '', rlist: [], totalList: [], selected: null, showList: false }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = 40.34; // position.coords.latitude
      const lng = -74.656; // position.coords.longitude
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
    if (this.state.selected || !this.state.showList) {
      this.setState({ selected: null, showList: true });
    }
    let rlist = this.state.totalList;
    const qarr = query.toLowerCase().split(' ');
    if (qarr.length === 0 || qarr[0] === '') {
      this.setState({ query, rlist: this.state.totalList });
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

  submitPhoto() {
    console.log('Not finished yet!');
  }

  renderListOrPhoto() {
    if (this.state.showList && this.state.rlist.length > 0) {
      return (
        <FlatList
          data={this.state.rlist}
          keyExtractor={restaurant => restaurant.id}
          renderItem={restaurant => this.renderRestaurant(restaurant.item)}
          keyboardShouldPersistTaps={'handled'}
          bounces={false}
          removeClippedSubviews={false}
        />
      );
    }
    return (
      <View>
        <View style={photoFrameStyle}>
          <Image
            style={photoStyle}
            source={{ uri: this.state.uploadPath }}
          />
        </View>

        <View style={buttonHolderStyle}>
          {this.renderButton()}
        </View>
      </View>
    );
  }

  renderRestaurant(restaurant) {
    return (
      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss();
          this.setState({ query: restaurant.name, selected: restaurant.id, showList: false });
        }}
      >
        <View style={restaurantDisplayStyle}>
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

  renderButton() {
    if (this.state.selected) {
      return (
        <Button
          onPress={() => this.submitPhoto()}
          colors={{ text: '#fff', fill: '#ff9700', border: '#ff9700' }}
        >
          Post
        </Button>
      );
    }
    return (
      <Button
        onPress={() => {}}
        colors={{ text: '#fff', fill: '#ffcb7f', border: '#ffcb7f' }}
      >
        Post
      </Button>
    );
  }

  render() {
    if (this.state.uploadPath) {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            if (this.state.rlist.length === 1) {
              const restaurant = this.state.rlist[0];
              this.setState({ query: restaurant.name, selected: restaurant.id, showList: false });
            } else {
              this.setState({ showList: false });
            }
          }}
        >
          <View style={pageStyle}>
            <Header>
              <Ionicon.Button
                name='ios-arrow-back'
                backgroundColor='white'
                color='black'
                size={30}
                onPress={() => {
                  deleteImage(this.state.uploadPath);
                  AsyncStorage.setItem('UploadPath', '');
                  this.props.navigation.dispatch(NavigationActions.back());
                }}
              />
            </Header>

            <View style={{ margin: 70, marginTop: 30 }}>
              <Text style={headerTextStyle}>You took this picture at</Text>
              <View style={containerStyle}>
                <TextInput
                  style={inputTextStyle}
                  value={this.state.query}
                  onChangeText={query => this.updateQuery(query)}
                  onFocus={() => this.setState({ showList: true })}
                  autoCorrect={false}
                  underlineColorAndroid={'transparent'}
                />
              </View>

              {this.renderListOrPhoto()}

            </View>
          </View>
        </TouchableWithoutFeedback>

      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }} />
    );
  }
}

const styles = {
  pageStyle: {
    flex: 1,
    flexDirection: 'column'
  },
  headerTextStyle: {
    fontSize: 18,
    color: '#aaa',
    fontWeight: '500',
    fontFamily: 'Avenir'
  },
  containerStyle: {
    flexDirection: 'row',
    marginBottom: 10,
    height: 32,
    borderBottomWidth: 2,
    borderColor: '#000'
  },
  photoFrameStyle: {
    flexDirection: 'row',
    borderRadius: 7,
    overflow: 'hidden',
    marginTop: 35,
    marginBottom: 60,
    elevation: 2
  },
  photoStyle: { // The picture
    flex: 1,
    width: null,
    height: Dimensions.get('window').width - 140,
  },
  buttonHolderStyle: {
    flexDirection: 'row',
    marginHorizontal: 50,
  },
  inputTextStyle: {
    fontFamily: 'Avenir',
    paddingVertical: 1,
    color: '#000',
    fontSize: 16,
    flex: 1
  },
  restaurantDisplayStyle: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2
  }
};

const {
  pageStyle,
  headerTextStyle,
  containerStyle,
  photoFrameStyle,
  photoStyle,
  buttonHolderStyle,
  inputTextStyle,
  restaurantDisplayStyle
} = styles;

export default CameraLocationPage;
