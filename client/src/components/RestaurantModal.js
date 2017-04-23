import React, { Component } from 'react';
import { View, Modal, TouchableWithoutFeedback } from 'react-native';
import RestaurantDetail from './RestaurantDetail';

class RestaurantModal extends Component {
  state = { modalVisible: false }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  render() {
    console.log(this.props.restaurant);
    return (
      <View>
        <Modal
          animationType={'fade'}
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => { this.setModalVisible(false); }}
        >
          <View style={{ flex: 1, paddingTop: 15 }}>
            <RestaurantDetail
              restaurant={this.props.restaurant}
              close={this.closeModal.bind(this)}
            />
          </View>
        </Modal>

        <TouchableWithoutFeedback onPress={() => this.setModalVisible(true)}>
          {this.props.children}
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default RestaurantModal;
