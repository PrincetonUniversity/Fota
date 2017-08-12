/******************************************************************************
 * Called by: Account/UserPage, Photo/PhotoDetail, Search/SearchPage
 * Dependencies: common/CardSection, ./RestaurantDetail, ./CommentUpload
 *
 * Description: Either returns a pop-up (long press) or a Navigator component
 * for switching between the different restaurant pages. Displayed when the user
 * taps a picture (Account/UserPage, Photo/PhotoDetail) or selects a restaurant
 * (Search/SearchPage).
 *
 ******************************************************************************/

import React, { Component } from 'react';
import {
  Text, View, Modal,
  TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';
import request from '../../helpers/axioshelper';
import { restRequest } from '../../helpers/URL';
import { CardSection } from '../common';
import RestaurantDetail from './RestaurantDetail';
import CommentUpload from './CommentUpload';

class RestaurantModal extends Component {
  state = { modalVisible: false, longPressed: false, restaurant: null }

  // componentWillMount() {
  //   request.get(restRequest(this.props.restaurantid))
  //   .then(response => this.setState({ restaurant: response.data }))
  //   .catch(e => request.showErrorAlert(e));
  // }

  onPressed(long) {
    if (long) {
      if (this.props.options) {
        this.setState({ longPressed: true }, () => this.setModalVisible(true));
      }
    } else if (this.state.longPressed) {
      this.setState({ longPressed: false }, () => this.setModalVisible(true));
    } else {
      request.get(restRequest(this.props.restaurantid))
      .then(response => this.setState({ restaurant: response.data, modalVisible: true }))
      .catch(e => request.showErrorAlert(e));
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  closeModal() {
    this.setState({ modalVisible: false });
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
        <CardSection>
          <Text style={styles.popupTextStyle}>{option.name}</Text>
        </CardSection>
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
      <View style={styles.modalStyle}>
        <RestaurantDetail
          navigator={navigator}
          restaurant={this.state.restaurant}
          close={this.closeModal.bind(this)}
        />
      </View>
    );
  }

  render() {
    return (
      <View>
        <Modal
          animationType={'fade'}
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => { this.setModalVisible(false); }}
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
  modalStyle: { // For the faded out part
    flex: 1,
    justifyContent: 'center',
    //backgroundColor: 'rgba(0,0,0,0.5)'
  },
  popupStyle: {
    //marginHorizontal: 20,
  },
  popupTextStyle: {
    fontSize: 17,
    padding: 5
  }
};

export default RestaurantModal;
