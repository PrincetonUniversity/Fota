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
    return (
      <View>
        <Modal
          animationType={'fade'}
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => { this.setModalVisible(false); }}
        >
          <View style={styles.modalStyle}>
            <View style={{ ...this.props.pageStyle, ...styles.pageStyle }}>
              <RestaurantDetail
                restaurant={this.props.restaurant}
                close={this.closeModal.bind(this)}
              />
            </View>
          </View>
        </Modal>

        <TouchableWithoutFeedback onPress={() => this.setModalVisible(true)}>
          {this.props.children}
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = {
  modalStyle: { // For the faded out part
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  pageStyle: {
    flex: 1
  }
};

export default RestaurantModal;
