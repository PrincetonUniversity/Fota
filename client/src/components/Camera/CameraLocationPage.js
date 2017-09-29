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
  View, Image, Text, FlatList, TouchableWithoutFeedback, CameraRoll, ImageStore,
  Keyboard, TouchableOpacity, Alert, LayoutAnimation, Platform
} from 'react-native';
import { connect } from 'react-redux';
import RNFetchBlob from 'react-native-fetch-blob';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import Octicon from 'react-native-vector-icons/Octicons';
// eslint-disable-next-line
import ImageResizer from 'react-native-image-resizer';
import firebase from 'firebase';
import uuid from 'uuid/v1';
import { Header, Button, Input, Spinner } from '../common';
import { cameraErrorAlert } from './CameraPage';
import { setLastUploaded } from '../../actions';
import request from '../../helpers/axioshelper';
import {
  nearbyRestRequest, checkPhotoRequest, uploadPhotoRequest, searchRequest
} from '../../helpers/URL';
import { pcoords } from '../../Base';
import icoMoonConfig from '../../selection.json';

const Icon = createIconSetFromIcoMoon(icoMoonConfig);

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const rDisplayHeight = 60;

// why doesn't javascript have printf() or format()?
const dayformat = (day) => (
  (day < 10 && day >= 0) ? `0${day}` : `${day}`
);

const deleteImage = (path) => {
  const filepath = path.replace(/^(file:\/+)/, '/');
  RNFetchBlob.fs.exists(filepath)
  .then((result) => {
    if (result) {
      return RNFetchBlob.fs.unlink(filepath)
      .catch((e) => { console.log(e); cameraErrorAlert(); });
    }
  })
  .catch((e) => { console.log(e); cameraErrorAlert(); });
};

class CameraLocationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadPath: null,
      query: '',
      rlist: [],
      selected: null,
      index: -1,
      nearBottom: false,
      hidePhoto: false,
      saveState: -1,
      submitting: false,
      error: null,
      markForDelete: false
    };
    this.totalList = [];
    this.submitting = false;
    this.firebaseRef = null;
    this.firebaseRefSmall = null;
    this.firebaseURL = null;
    this.firebaseSmallURL = null;
    this.reuri = null;
    this.labels = [];
    this.lat = null;
    this.lng = null;
  }

  componentWillMount() {
    if (this.props.browsingPrinceton) {
      this.sendLocationRequest(pcoords.lat, pcoords.lng);
    } else {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.sendLocationRequest(this.lat, this.lng);
      },
      e => request.showErrorAlert(e),
      /*{ enableHighAccuracy: Platform.OS === 'ios', timeout: 5000, maximumAge: 10000 }*/);
    }
  }

  componentDidMount() {
    const path = this.props.navigation.state.params.path;
    this.setState({ uploadPath: path });
    this.generateFileNames();
    this.uploadPhotoToFirebase(path, this.firebaseRef)
    .then(url => {
      request.post(checkPhotoRequest(), { url })
      .then(response => {
        if (this.state.markForDelete) {
          this.deletePhotoFromFirebase();
        } else if (this.state.submitting && this.firebaseSmallURL) {
          this.submitPhoto(url, this.firebaseSmallURL, response.data.matchingCategories);
        } else {
          this.firebaseURL = url;
          this.labels = response.data.matchingCategories;
        }
      })
      .catch(e => {
        if (this.state.markForDelete) {
          this.deletePhotoFromFirebase();
        } else if (this.state.submitting) {
          if (e.etype === 1 && e.response.status === 400) {
            this.showNotFoodAlert(e.response.data.error);
          } else {
            request.showErrorAlert(e);
          }
        } else if (e.etype === 1 && e.response.status === 400) {
          this.firebaseURL = url;
          this.setState({ error: e.response.data.error });
        } else {
          this.firebaseURL = url;
          this.setState({ error: 'OTHER' });
        }
      });
    })
    .catch((e) => { console.log(e); cameraErrorAlert(); });
    ImageResizer.createResizedImage(path, 250, 500, 'JPEG', 100).then(reuri => {
      this.reuri = reuri;
      this.uploadPhotoToFirebase(reuri, this.firebaseRefSmall)
      .then(urlSmall => {
        if (this.state.markForDelete) {
          this.deletePhotoFromFirebase();
        } else if (this.state.submitting && this.firebaseURL) {
          this.submitPhoto(this.firebaseURL, urlSmall, this.labels);
        } else {
          this.firebaseSmallURL = urlSmall;
        }
      })
      .catch((e) => { console.log(e); cameraErrorAlert(); });
    }).catch((e) => { console.log(e); cameraErrorAlert(); });
  }

  onViewableItemsChanged = ({ viewableItems }) => {
    if (!this.state.hidePhoto && viewableItems[0]) {
      if (viewableItems[0].index >= this.state.rlist.length - 7) {
        this.setState({ nearBottom: true });
      } else if (this.state.nearBottom) {
        this.setState({ nearBottom: false });
      }
    }
  }

  cleanup() {
    if (this.props.navigation.state.params.del) {
      deleteImage(this.props.navigation.state.params.full);
    }
    if (this.state.uploadPath.startsWith('rct-image-store')) {
      ImageStore.removeImageForTag(this.state.uploadPath);
    } else {
      deleteImage(this.state.uploadPath);
    }
  }

  sendLocationRequest(lat, lng) {
    request.get(nearbyRestRequest(lat, lng)).then(response => {
      this.totalList = response.data;
      if (this.props.lastUploaded) {
        const now = new Date();
        if (now.getTime() - this.props.lastUploaded.time <= 300000) {
          this.setState({ selected: this.props.lastUploaded.restaurant });
        }
      }
      this.updateQuery('');
    })
    .catch(e => request.showErrorAlert(e));
  }

  updateQuery(query) {
    let rlist = this.totalList;
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
        if (word.startsWith(current) || qarr.length === 0 && word.includes(current)) return true;
      }
      return false;
    });
    rlist = rlist.slice(0, 20);
    if (rlist.length === 0) {
      this.setState({ query });
      if (!this.lat && !this.lng) {
        Alert.alert(
          'Oops!',
          'We had trouble finding your location. Please restart the app and try again.',
          [{ text: 'OK' }]
        );
        return;
      }
      const fQuery = encodeURIComponent(query);
      request.get(searchRequest(this.lat, this.lng, fQuery))
      .then(response => {
        this.setState({
          rlist: response.data.restaurants,
        });
      })
      .catch(e => request.showErrorAlert(e));
      //set rlist to the search result
    } else {
      this.setState({ query, rlist });
    }
  }

  generateFileNames() {
    const d = new Date();
    const today = `${d.getFullYear()}${dayformat(d.getMonth() + 1)}${dayformat(d.getDate())}`;
    const imageName = `${this.props.loginState.uid}-${uuid()}`;
    this.firebaseRef = `fota_photos/${today}/${imageName}.jpg`;
    this.firebaseRefSmall = `fota_photos/${today}/${imageName}-small.jpg`;
  }

  uploadPhotoToFirebase(path, firebasePath, mime = 'image/jpg') {
    const filepath = path.replace(/^(file:)/, '');
    return new Promise((resolve, reject) => {
      let uploadBlob = null;
      const imageRef = firebase.storage().ref().child(firebasePath);
      if (path.startsWith('rct-image-store')) {
        ImageStore.getBase64ForTag(path,
          (data) => {
            Blob.build(data, { type: `x${mime};BASE64` })
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
          },
        (e) => console.log(e)
        );
      } else {
        fs.readFile(filepath, 'base64')
          .then((data) => (
             Blob.build(data, { type: `x${mime};BASE64` })
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
      }
    });
  }

  deletePhotoFromFirebase() {
    if (this.firebaseRef) {
      const deleteRef = firebase.storage().ref().child(this.firebaseRef);
      deleteRef.delete();
    }
    if (this.firebaseRefSmall) {
      const deleteSmallRef = firebase.storage().ref().child(this.firebaseRefSmall);
      deleteSmallRef.delete();
    }
  }

  pressUploadButton() {
    if (this.submitting) return;
    this.submitting = true;
    this.setState({ hidePhoto: false, submitting: true });
    if (this.firebaseURL) {
      if (this.state.error) {
        this.showNotFoodAlert(this.state.error);
      } else {
        this.submitPhoto(this.firebaseURL, this.firebaseSmallURL, this.labels);
      }
    }
  }

  submitPhoto(url, urlSmall, labels) {
    request.post(uploadPhotoRequest(), {
      url,
      urlSmall,
      restaurantId: this.state.selected,
      matchingCategories: labels
    }).then(() => {
      const now = new Date();
      this.props.setLastUploaded({
        time: now.getTime(),
        restaurant: this.state.selected
      });
      deleteImage(this.reuri);
      this.cleanup();
      this.props.screenProps.onCameraClose();
      this.props.navigateToHome();
      this.props.navigateToNew(true);
    }).catch(error => request.showErrorAlert(error));
  }

  showNotFoodAlert(error) {
    Alert.alert(
      'Invalid Photo',
      'You may have uploaded an invalid photo. Please make sure you submit a picture of food.',
      [{
        text: 'OK',
        onPress: () => {
          this.cleanup();
          this.deletePhotoFromFirebase();
          this.props.navigation.goBack();
        }
      }]
    );
  }

  saveToCameraRoll() {
    this.setState({ saveState: 0 });
    CameraRoll.saveToCameraRoll(this.props.navigation.state.params.full)
    .then(() => this.setState({ saveState: 1 }))
    .catch((e) => {
      this.setState({ saveState: -1 });
      console.log(e);
      cameraErrorAlert();
    });
  }

  handleOpeningBoxOnIOS() {
    if (this.state.nearBottom && this.state.rlist.length !== 0) {
      if (this.state.rlist.length < 7) {
        this.flatListRef.scrollToIndex({ animated: true, index: 0 });
      } else {
        this.flatListRef.scrollToIndex({ animated: false, index: this.state.rlist.length - 7 });
      }
    }
  }

  handleClosingBoxOnIOS() {
    if (this.state.selected && this.state.rlist.length > 4 && this.state.index > this.state.rlist.length - 4) {
      this.flatListRef.scrollToIndex({ animated: true, index: this.state.rlist.length - 4 });
    }
    this.setState({ hidePhoto: false });
  }

  handleClosingBoxOnAndroid() {
    this.setState({ hidePhoto: false });
    if (this.state.selected && this.state.rlist.length > 4 && this.state.index > this.state.rlist.length - 4) {
      setTimeout(() => {
        this.flatListRef.scrollToIndex({ animated: true, index: this.state.index });
      }, 350);
    }
  }

  handleSelectOnIOS(restaurant, index) {
    if (this.state.rlist.length > 4) {
      if (index > this.state.rlist.length - 4) {
        this.flatListRef.scrollToIndex({ animated: false, index: this.state.rlist.length - 4 });
      } else {
        this.flatListRef.scrollToIndex({ animated: true, index });
      }
    }
    this.setState({ selected: restaurant.id, index, hidePhoto: false });
  }

  handleSelectOnAndroid(restaurant, index) {
    const needTimeout = (this.state.hidePhoto && this.state.rlist.length > 4 && index > this.state.rlist.length - 4);
    this.setState({ selected: restaurant.id, index, hidePhoto: false });
    if (needTimeout) {
      setTimeout(() => {
        this.flatListRef.scrollToIndex({ animated: true, index });
      }, 350);
    } else {
      this.flatListRef.scrollToIndex({ animated: true, index });
    }
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
            //this.updateQuery(this.state.query);
          } else {
            if (Platform.OS === 'ios') {
              this.handleSelectOnIOS(restaurant, index);
            } else {
              this.handleSelectOnAndroid(restaurant, index);
            }
            //this.updateQuery(this.state.query);
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
              Princeton, NJ
            </Text>
          </View>
          <Text style={[restaurantSubtextStyle, { paddingLeft: 5 }]}>
            {restaurant.distance.toFixed(1)} mi.
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderSaveIcon() {
    if (!this.props.navigation.state.params.del) return;
    if (this.state.saveState === -1) {
      return (
        <TouchableOpacity style={downloadButtonStyle} onPress={() => this.saveToCameraRoll()}>
          <Icon name='download' backgroundColor='transparent' color='white' size={20} />
        </TouchableOpacity>
      );
    } else if (this.state.saveState === 0) {
      return (
        <View style={downloadButtonStyle}>
          <Spinner size='small' color='white' />
        </View>
      );
    }
    return (
      <View style={downloadButtonStyle}>
        <Octicon name='check' backgroundColor='transparent' color='white' size={25} style={{ paddingLeft: 8 }} />
      </View>
    );
  }

  renderPhoto() {
    if (!this.state.hidePhoto) {
      return (
        <View style={photoFrameStyle}>
          <View>
            <Image style={photoStyle} source={{ uri: this.state.uploadPath }} />
            {this.renderSaveIcon()}
          </View>
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
            if (Platform.OS === 'ios') {
              this.handleClosingBoxOnIOS();
            } else {
              this.handleClosingBoxOnAndroid();
            }
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
    let color = 'rgba(0,0,0,0.3)';
    let action = () => {};
    if (this.state.selected) {
      color = '#2494ff';
      action = () => this.pressUploadButton();
    }
    return (
      <Button
        onPress={action}
        colors={{ text: color, fill: '#fff', border: '#fff' }}
        text={'UPLOAD'}
      >
        <Icon name='upload_camera' color={color} size={22} />
      </Button>
    );
  }

  render() {
    if (this.state.uploadPath) {
      let listHeight = rDisplayHeight * 4;
      if (this.state.hidePhoto) {
        listHeight = rDisplayHeight * 7;
      }
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={pageStyle}>
            <Header text='Ready to Share?' iosHideStatusBar>
              <View style={{ position: 'absolute', left: 25 }}>
                <TouchableOpacity
                  style={backButtonStyle}
                  onPress={() => {
                    if (this.submitting) return;
                    if (this.firebaseURL) {
                      this.deletePhotoFromFirebase();
                    } else {
                      this.setState({ markForDelete: true });
                    }
                    this.cleanup();
                    this.props.navigation.goBack();
                  }}
                >
                  <Icon
                    name='back'
                    backgroundColor='white'
                    color='rgba(0,0,0,0.7)'
                    size={19}
                  />
                </TouchableOpacity>
              </View>
            </Header>

            <View style={bodyStyle}>
              {this.renderPhoto()}

              <View style={selectorTitleStyle}>
                <View style={{ flexDirection: 'row' }}>
                  <Icon name='location' size={19} color='rgba(0,0,0,0.7)' />
                  <Text style={selectorTitleTextStyle}>Restaurant</Text>
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
                    autocorrect={false}
                    onFocus={() => {
                      if (this.submitting) return;
                      LayoutAnimation.easeInEaseOut();
                      if (Platform.OS === 'ios') this.handleOpeningBoxOnIOS();
                      this.setState({ hidePhoto: true });
                    }}
                  >
                    <Icon
                      name='search'
                      size={15}
                      color='rgba(0,0,0,0.34)'
                      style={{ marginRight: 5 }}
                    />
                  </Input>
                </View>

                <FlatList
                  ref={(ref) => { this.flatListRef = ref; }}
                  data={this.state.rlist}
                  keyExtractor={restaurant => restaurant.id}
                  renderItem={restaurant => this.renderRestaurant(
                    restaurant.item,
                    restaurant.item.id === this.state.selected,
                    restaurant.index
                  )}
                  getItemLayout={(data, index) => (
                    { length: rDisplayHeight, offset: rDisplayHeight * index, index }
                  )}
                  onViewableItemsChanged={this.onViewableItemsChanged}
                  overScrollMode='never'
                  style={{ height: listHeight }}
                  keyboardShouldPersistTaps={'handled'}
                  bounces={false}
                  keyboardDismissMode='on-drag'
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
  },
  backButtonStyle: {
    backgroundColor: 'transparent',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  photoFrameStyle: {
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.09)',
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
    zIndex: 1
  },
  photoStyle: {
    width: 150,
    height: 150,
    borderRadius: 7
  },
  downloadButtonStyle: {
    position: 'absolute',
    bottom: 3,
    right: 8,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 6
  },
  bodyStyle: {
    paddingHorizontal: 50,
    marginVertical: 10,
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start'
  },
  selectorTitleStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    zIndex: 7,
    paddingVertical: 10
  },
  selectorTitleTextStyle: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 5,
    color: 'rgba(0,0,0,0.67)'
  },
  cancelTextStyle: {
    fontSize: 17,
    color: 'rgba(0,0,0,0.38)',
    paddingRight: 5
  },
  listContainerStyle: {
    borderRadius: 7,
    overflow: 'hidden',
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    backgroundColor: 'white',
    zIndex: 3
  },
  searchBarStyle: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 12,
    height: 32,
  },
  labelStyle: {
    width: 15,
    height: 15,
  },
  buttonHolderStyle: {
    height: 70,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.09)',
    justifyContent: 'center',
    //flexDirection: 'row',
    borderWidth: 1,
    marginTop: 30
  },
  chosenIndicatorStyle: {
    width: 5,
    marginRight: 10,
    backgroundColor: '#ff7f00',
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
    alignItems: 'center',
    backgroundColor: 'white'
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
  backButtonStyle,
  photoFrameStyle,
  photoStyle,
  downloadButtonStyle,
  bodyStyle,
  selectorTitleStyle,
  selectorTitleTextStyle,
  cancelTextStyle,
  listContainerStyle,
  searchBarStyle,
  buttonHolderStyle,
  chosenIndicatorStyle,
  restaurantDisplayStyle,
  restaurantTextStyle,
  restaurantSubtextStyle
} = styles;

function mstp({ loginState, browsingPrinceton, navigateToHome, navigateToNew, lastUploaded }) {
  return { loginState, browsingPrinceton, navigateToHome, navigateToNew, lastUploaded };
}

export default connect(mstp, { setLastUploaded })(CameraLocationPage);
