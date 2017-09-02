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
import Modal from 'react-native-modal';
import request from '../../helpers/axioshelper';
import { restRequest, restCommentRequest } from '../../helpers/URL';
import RestaurantDetail from './RestaurantDetail';

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
      this.setState({ longPressed: false }, () => this.setModalVisible(true));
    } else {
      this.setState({ loading: true });
      request.get(restRequest(this.props.restaurantid))
        .then(response => {
          request.get(restCommentRequest(this.props.restaurantid))
            .then(response2 =>
              this.setState({
                restaurant: response.data,
                comments: response2.data,
                loading: false
              }))
            .catch(e => request.showErrorAlert(e));
        })
        .catch(e => request.showErrorAlert(e));
      this.setModalVisible(true);
      Animated.timing(this.state.position, {
        toValue: { x: 0, y: 0 }
      }).start();
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
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
          option.onClick();
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
          close={() => this.setModalVisible(false)}
        />
      </Animated.View>
    );
  }

  render() {
    return (
      <View>
        <Modal
          animationIn='slideInRight'
          animationOut='slideOutRight'
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
    justifyContent: 'center'
    //backgroundColor: 'rgba(0,0,0,0.5)'
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

export default RestaurantModal;
