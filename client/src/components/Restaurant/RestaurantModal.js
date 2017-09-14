/******************************************************************************
 * Called by: Account/UserPage, Photo/PhotoDetail, Search/SearchPage
 * Dependencies: common/CardSection, ./RestaurantDetail
 *
 * Description: Either returns a pop-up (long press) or a Navigator component
 * for switching between the different restaurant pages. Displayed when the user
 * taps a picture (Account/UserPage, Photo/PhotoDetail) or selects a restaurant
 * (Search/SearchPage).
 *
 ******************************************************************************/

import React, { Component } from 'react';
import {
  Text, View, Animated, PanResponder, Dimensions,
  TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import RestaurantDetail from './RestaurantDetail';
import request from '../../helpers/axioshelper';
import { restRequest, restCommentRequest, directionsRequest, coordinateRequest } from '../../helpers/URL';
import { pcoords } from '../../Base';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH / 2;

class RestaurantModal extends Component {

  constructor(props) {
    super(props);
    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        if (gesture.dx > 0) {
          position.setValue({ x: gesture.dx });
        }
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          Animated.timing(this.state.position, {
            toValue: { x: SCREEN_WIDTH, y: 0 },
            duration: 100
          }).start(() => this.setState({ modalVisible: false }));
        } else {
          this.resetPosition();
        }
      },
      onPanResponderTerminationRequest: (event, gesture) => {}
    });

    this.state = {
      modalVisible: false,
      longPressed: false,
      loading: false,
      restaurant: null,
      comments: [],
      mapsData: null,
      panResponder,
      position
    };
  }

  onPressed(long) {
    if (long) {
      if (this.props.options) {
        this.setState({ longPressed: true }, () => this.setModalVisible(true));
      }
    } else if (this.state.longPressed) {
      this.setState({ longPressed: false }, () => this.openRestaurantPage());
    } else {
      this.openRestaurantPage();
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  openRestaurantPage() {
    this.setState({ loading: true, modalVisible: true });
    if (this.props.browsingPrinceton) {
      this.sendNavigationRequest(pcoords.lat, pcoords.lng);
    } else {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.sendNavigationRequest(lat, lng);
      },
      e => request.showErrorAlert(e),
      /*{ enableHighAccuracy: Platform.OS === 'ios', timeout: 5000, maximumAge: 10000 }*/);
    }
    //this.setModalVisible(true);
    Animated.timing(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  sendNavigationRequest(lat, lng) {
    request.get(coordinateRequest(this.props.restaurantid)).then(response => {
      const destLat = response.data.latitude;
      const destLng = response.data.longitude;
      const promises = [
        request.get(restRequest(this.props.restaurantid)),
        request.get(restCommentRequest(this.props.restaurantid)),
        request.get(directionsRequest(lat, lng, destLat, destLng, 'walking')),
        request.get(directionsRequest(lat, lng, destLat, destLng, 'driving'))
      ];
      Promise.all(promises).then(result => {
        const walkDirections = result[2].data;
        const driveDirections = result[3].data;
        const walkTime = walkDirections.routes[0].legs[0].duration.text.replace(/s$/, '');
        const driveTime = driveDirections.routes[0].legs[0].duration.text.replace(/s$/, '');
        const distance = walkDirections.routes[0].legs[0].distance.text;
        const showWalk = (!walkTime.includes('hour') && parseInt(walkTime) <= 15);
        this.setState({
          restaurant: result[0].data,
          comments: result[1].data,
          loading: false,
          mapsData: { walking: showWalk, walkTime, driveTime, distance }
        });
      }).catch(e => request.showErrorAlert(e));
    }).catch(e => request.showErrorAlert(e));
  }

  resetPosition() {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  renderOptions() {
    return this.props.options.map(option => (
      <TouchableOpacity
        key={option.name}
        activeOpacity={0.9}
        onPress={() => {
          this.setModalVisible(false);
          setTimeout(() => option.onClick(this.props.photoid), 600);
        }}
      >
        <View style={styles.optionsCardStyle}>
          <Text style={styles.popupTextStyle}>{option.name}</Text>
        </View>
      </TouchableOpacity>

    ));
  }

  renderPopup() {
    if (this.state.longPressed) {
      return (
        <TouchableWithoutFeedback onPress={() => { this.setModalVisible(false); }}>
          <View style={styles.modalStyle}>
            <View style={styles.popupStyle}>
              {this.renderOptions()}
            </View>
          </View>
        </TouchableWithoutFeedback>

      );
    }
    return (
        <Animated.View
          {...this.state.panResponder.panHandlers}
          style={[this.state.position.getLayout(), styles.modalStyle]}
        >
          <RestaurantDetail
            loading={this.state.loading}
            restaurant={this.state.restaurant}
            comments={this.state.comments}
            mapsData={this.state.mapsData}
            close={() => this.setModalVisible(false)}
          />
        </Animated.View>
    );
  }

  render() {
    const animIn = this.state.longPressed ? 'fadeIn' : 'slideInRight';
    const animOut = this.state.longPressed ? 'fadeOut' : 'slideOutRight';
    return (
      <View>
        <Modal
          animationIn={animIn}
          animationOut={animOut}
          transparent
          style={{ margin: 0, padding: 0 }}
          isVisible={this.state.modalVisible}
          onBackButtonPress={() => { this.setModalVisible(false); }}
        >
          {this.renderPopup()}
        </Modal>

        <TouchableWithoutFeedback
          onPress={() => this.onPressed(false)}
          onLongPress={() => this.onPressed(true)}
        >
          {this.props.children}
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = {
  modalStyle: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  popupStyle: {
    marginHorizontal: 20,
  },
  popupTextStyle: {
    fontSize: 17,
    padding: 5
  },
  optionsCardStyle: {
    padding: 10,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'relative'
  }
};

function mapStateToProps({ browsingPrinceton }) {
  return { browsingPrinceton };
}

export default connect(mapStateToProps)(RestaurantModal);
