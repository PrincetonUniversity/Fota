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
  View, Image, Text, FlatList, AsyncStorage, TouchableWithoutFeedback, ScrollView,
  Keyboard, TouchableOpacity, Alert, LayoutAnimation
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import RNFetchBlob from 'react-native-fetch-blob';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from 'firebase';
import uuid from 'uuid/v1';
import request from '../../helpers/axioshelper';
import { Header, Button, Input, Spinner } from '../common';
import { deleteImage, cameraErrorAlert } from './CameraPage';
import { nearbyRestRequest, uploadPhotoRequest } from '../../helpers/URL';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const restaurantDisplayHeight = 60;

// why doesn't javascript have printf() or format()?
const dayformat = (day) => (
  (day < 10 && day >= 0) ? `0${day}` : `${day}`
);

class CameraLocationPage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      uploadPath: null, 
      query: '', 
      rlist: [], 
      totalList: [], 
      selected: null, 
      index: -1,
      hidePhoto: false, 
      submitting: false 
    };
    this.submitting = false;
    this.selectedName = null;
    this.firebaseRef = null;
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      request.get(nearbyRestRequest(lat, lng))
        .then(response => {
          this.setState({ totalList: response.data });
          this.updateQuery('');
        })
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
      rlist = rlist.slice(0, 20);
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
      const arr = restaurant.name.toLowerCase().split(' ');
      for (const word of arr) {
        if (word.startsWith(current)) return true;
      }
      return false;
    });
    rlist = rlist.slice(0, 20);
    this.setState({ query, rlist });
  }

  uploadPhotoToFirebase(path, mime = 'image/jpg') {
    const filepath = path.replace(/^(file:)/, '');
    const d = new Date();
    const today = `${d.getFullYear()}${dayformat(d.getMonth())}${dayformat(d.getDate())}`;
    const imageName = `${this.props.loginState.uid}-${uuid()}.jpg`;
    this.firebaseRef = `fota_photos/${today}/${imageName}`;
    return new Promise((resolve, reject) => {
      let uploadBlob = null;
      const imageRef = firebase.storage().ref().child(`fota_photos/${today}/${imageName}`);
      fs.readFile(filepath, 'base64')
        .then((data) => (
           Blob.build(data, { type: `${mime};BASE64` })
        ))
        .then((blob) => {
          uploadBlob = blob;
          return imageRef.put(blob, { contentType: mime });
        })
        .then(() => {
          uploadBlob.close();
          return imageRef.getDownloadURL();
        })
        .then((url) => {
          resolve(url);
        })
        .catch((error) => {
          reject(error);
      });
    });
  }

  deletePhotoFromFirebase() {
    if (!this.firebaseRef) return;
    const deleteRef = firebase.storage().ref().child(this.firebaseRef);
    deleteRef.delete();
  }

  submitPhoto() {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    this.setState({ hidePhoto: false, submitting: true });
    this.uploadPhotoToFirebase(this.state.uploadPath)
    .then(url => {
      request.post(uploadPhotoRequest(), { url, restaurantId: this.state.selected.id })
      .then(() => this.props.screenProps.goBack())
      .catch(error => {
        if (error.etype === 1 && error.response.status === 400) {
          Alert.alert(
            'Invalid Photo',
            'You may have uploaded an invalid photo. Please make sure you submit a picture of food.',
            [{
              text: 'OK', 
              onPress: () => {
                this.deletePhotoFromFirebase();
                this.props.navigation.goBack(); 
              } 
            }]
          );
        } else {
          request.showErrorAlert(error);              
        }
      });
    })
    .catch(() => cameraErrorAlert());
  }

  renderRestaurant(restaurant, chosen, index) {
    return (
      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss();
          LayoutAnimation.easeInEaseOut();
          if (this.submitting) return;
          if (chosen) {
            this.setState({ selected: null, index: -1 });
            this.selectedName = null;
            this.updateQuery(this.state.query);
          } else {
            if (index > this.state.rlist.length - 4) {
              this.flatListRef.scrollToEnd({ animated: true });
            } else {
              this.flatListRef.scrollToIndex({ animated: true, index });
            }
            this.setState({ selected: restaurant, index, hidePhoto: false });
            this.selectedName = restaurant.name;
            this.updateQuery(this.state.query);
          }
        }}
      >
        <View style={restaurantDisplayStyle}>
          {chosen && <View style={chosenIndicatorStyle} />}
          <View style={{ flexDirection: 'column', flex: 1, alignItems: 'flex-start' }}>
            <Text ellipsizeMode='tail' numberOfLines={1} style={restaurantTextStyle}>
              {restaurant.name}
            </Text>
            <Text ellipsizeMode='tail' numberOfLines={1} style={restaurantSubtextStyle}>
              Frist Campus Center
            </Text>
          </View>
          <Text style={[restaurantSubtextStyle, { paddingLeft: 5 }]}>
            {restaurant.distance.toPrecision(1)} mi.
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
            LayoutAnimation.easeInEaseOut();
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
        <Icon name='file-upload' color={color} size={25} />
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
            <Header text='Ready to Share?' iosHideStatusBar>
              <View style={{ position: 'absolute', left: 10 }}>
                <Ionicon.Button
                  name='ios-arrow-back'
                  backgroundColor='white'
                  color='black'
                  size={20}
                  onPress={() => {
                    if (this.submitting) return;
                    deleteImage(this.state.uploadPath);
                    AsyncStorage.setItem('UploadPath', '');
                    this.props.navigation.dispatch(NavigationActions.back());
                  }}
                />
              </View>
            </Header>

            <View style={{ paddingHorizontal: 50, marginVertical: 10, flex: 1, justifyContent: 'flex-start' }}>
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
                    placeholder="Where'd you take this?"
                    value={this.state.query}
                    onChangeText={query => this.updateQuery(query)}
                    onFocus={() => {
                      if (this.submitting) return;
                      LayoutAnimation.easeInEaseOut();
                      this.setState({ hidePhoto: true });
                    }}
                  >
                    <Image
                      style={labelStyle}
                      source={require('../../img/magnifying_glass_unactivated.png')}
                    />
                  </Input>
                </View>

                {/* <ScrollView>
                  ref={(ref) => { this.scrollViewRef = ref; }}
                  {() => this.state.rlist.map((restaurant, index) => {
                    this.renderRestaurant(restaurant, restaurant.item.name, index);
                  })}
                </ScrollView> */}
                <FlatList
                  ref={(ref) => { this.flatListRef = ref; }}
                  data={this.state.rlist}
                  keyExtractor={restaurant => restaurant.id}
                  renderItem={restaurant => this.renderRestaurant(
                    restaurant.item, 
                    restaurant.item.name === this.selectedName,
                    restaurant.index
                  )}
                  getItemLayout={(data, index) => (
                    { length: restaurantDisplayHeight, offset: restaurantDisplayHeight * index, index }
                  )}
                  overScrollMode='never'
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
    width: 150,
    height: 150,
    borderRadius: 15
  },
  rHeaderStyle: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 5,
    color: 'rgba(0,0,0,0.67)'
  },
  cancelTextStyle: {
    fontSize: 17,
    color: '#aaa',
    paddingRight: 5
  },
  listContainerStyle: {
    borderRadius: 7,
    overflow: 'hidden',
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    flex: 1
  },
  searchBarStyle: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 12,
    height: 32,
  },
  labelStyle: {
    width: 15,
    height: 15,
    marginRight: 5
  },
  buttonHolderStyle: {
    height: 70,
    borderTopWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    marginTop: 25
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
    height: 60,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.09)',
    alignItems: 'center'
  },
  restaurantTextStyle: { 
    fontSize: 16, 
    fontWeight: '700',
    color: 'rgba(0,0,0,0.66)',
    flex: 1
  },
  restaurantSubtextStyle: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.47)',
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

function mapStateToProps({ loginState }) {
  return { loginState };
}

export default connect(mapStateToProps)(CameraLocationPage);
