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
  Keyboard, TouchableOpacity
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationActions } from 'react-navigation';
import request from '../../helpers/axioshelper';
import { Header, Button, Input, Spinner } from '../common';
import { deleteImage } from './CameraPage';

class CameraLocationPage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      uploadPath: null, 
      query: '', 
      rlist: [], 
      totalList: [], 
      selected: null, 
      hidePhoto: false, 
      submitting: false 
    };
    this.submitting = false;
    this.selectedName = null;
  }
  

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
    let rlist = this.state.totalList;
    const qarr = query.toLowerCase().split(' ');
    if (qarr.length === 0 || qarr[0] === '') {
      rlist = rlist.filter(restaurant => {
        if (restaurant.name === this.selectedName) {
          return false;
        }
        return true;
      });
      this.setState({ query, rlist });
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
      if (restaurant.name === this.selectedName) {
        return false;
      }
      const arr = restaurant.name.toLowerCase().split(' ');
      for (const word of arr) {
        if (word.startsWith(current)) return true;
      }
      return false;
    });
    this.setState({ query, rlist });
  }

  submitPhoto() {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    this.setState({ submitting: true });
    console.log('Not finished yet!');
  }

  renderSelectedRestaurant() {
    if (this.state.selected) {
      return this.renderRestaurant(this.state.selected, true);
    }
  }

  renderRestaurant(restaurant, chosen) {
    return (
      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss();
          if (chosen) {
            this.setState({ selected: null });
            this.selectedName = null;
            this.updateQuery(this.state.query);
          } else {
            this.setState({ selected: restaurant, hidePhoto: false });
            this.selectedName = restaurant.name;
            this.updateQuery(this.state.query);
          }
        }}
      >
        <View style={restaurantDisplayStyle}>
          {chosen && <View style={chosenIndicatorStyle} />}
          <Text style={restaurantTextStyle}>
            {restaurant.name}
          </Text>
          <Text style={restaurantSubtextStyle}>
            {restaurant.distance.toPrecision(2)} mi.
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderPhoto() {
    if (!this.state.hidePhoto) {
      return (
        <View style={photoFrameStyle}>
          <Image
            style={photoStyle}
            source={{ uri: this.state.uploadPath }}
          />
        </View>
      );
    }
  }

  renderCancelText() {
    if (this.state.hidePhoto) {
      return (
        <Text
          style={cancelTextStyle}
          onPress={() => {
            Keyboard.dismiss();
            this.setState({ hidePhoto: false });
          }}
        >
          Cancel
        </Text>
      );
    }
  }

  renderButton() {
    if (this.state.submitting) {
      return <Spinner size="large" />;
    }
    let color = '#aaa';
    let action = () => {};
    if (this.state.selected) {
      color = '#0097ff';
      action = () => this.submitPhoto();
    }
    return (
      <Button
        onPress={action}
        colors={{ text: color, fill: '#fff', border: '#fff' }}
        text={'Upload'}
      >
        <Icon name='file-upload' color={color} style={{ paddingVertical: 15 }} size={25} />
      </Button>
    );
  }

  render() {
    if (this.state.uploadPath) {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={pageStyle}>
            <Header>
              <Text style={headerTextStyle}>Ready to Share?</Text>
              <View style={{ position: 'absolute', left: 10 }}>
                <Ionicon.Button
                  name='ios-arrow-back'
                  backgroundColor='white'
                  color='black'
                  size={20}
                  onPress={() => {
                    deleteImage(this.state.uploadPath);
                    AsyncStorage.setItem('UploadPath', '');
                    this.props.navigation.dispatch(NavigationActions.back());
                  }}
                />
              </View>
            </Header>

            <View style={{ marginHorizontal: 50, marginVertical: 10, justifyContent: 'flex-start', flex: 1 }}>
              {this.renderPhoto()}

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Icon name='location-on' size={25} color='#444' />
                  <Text style={rHeaderStyle}>Restaurant</Text>
                </View>
                {this.renderCancelText()}
              </View>

              <View style={listContainerStyle}>
                <View style={{ flexDirection: 'row' }}>
                  <Input
                    style={searchBarStyle}
                    placeholder="Where'd you take this sick flick?"
                    value={this.state.query}
                    onChangeText={query => this.updateQuery(query)}
                    onFocus={() => this.setState({ hidePhoto: true })}
                  >
                    <Image
                      style={labelStyle}
                      source={require('../../img/magnifying_glass_unactivated.png')}
                    />
                  </Input>
                </View>

                {this.renderSelectedRestaurant()}

                <FlatList
                  data={this.state.rlist}
                  keyExtractor={restaurant => restaurant.id}
                  renderItem={restaurant => this.renderRestaurant(restaurant.item, false)}
                  keyboardShouldPersistTaps={'handled'}
                  bounces={false}
                  removeClippedSubviews={false}
                />
              </View>
            </View>

            <View style={buttonHolderStyle}>
              {this.renderButton()}
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
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  headerTextStyle: {
    fontSize: 17,
    fontWeight: '500',
    fontFamily: 'Avenir',
    color: '#444',
    textAlign: 'center',
    flex: 1
  },
  photoFrameStyle: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center'
  },
  photoStyle: {
    width: 200,
    height: 200,
    borderRadius: 15
  },
  rHeaderStyle: {
    fontSize: 18,
    fontFamily: 'Avenir',
    fontWeight: '400',
    marginHorizontal: 5,
    color: '#444'
  },
  cancelTextStyle: {
    fontSize: 17,
    fontFamily: 'Avenir',
    color: '#aaa',
    paddingRight: 5
  },
  listContainerStyle: {
    borderRadius: 7,
    overflow: 'hidden',
    borderColor: '#eee',
    borderWidth: 1,
    flex: 1
  },
  searchBarStyle: {
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    height: 32,
  },
  labelStyle: {
    width: 15,
    height: 15,
    marginRight: 5
  },
  buttonHolderStyle: {
    height: 60,
    borderTopWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row'
  },
  chosenIndicatorStyle: {
    width: 5,
    marginRight: 10,
    backgroundColor: '#ff9700',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0
  },
  restaurantDisplayStyle: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 2,
    borderColor: '#eee',
    alignItems: 'center'
  },
  restaurantTextStyle: { 
    fontFamily: 'Avenir',
    fontSize: 16, 
    color: '#444',
    fontWeight: '500',
    flex: 1
  },
  restaurantSubtextStyle: {
    fontFamily: 'Avenir',
    fontSize: 12,
    color: '#aaa',
    paddingLeft: 5
  }
};

const {
  pageStyle,
  headerTextStyle,
  photoFrameStyle,
  photoStyle,
  rHeaderStyle,
  cancelTextStyle,
  listContainerStyle,
  searchBarStyle,
  labelStyle,
  buttonHolderStyle,
  chosenIndicatorStyle,
  restaurantDisplayStyle,
  restaurantTextStyle,
  restaurantSubtextStyle
} = styles;

export default CameraLocationPage;
