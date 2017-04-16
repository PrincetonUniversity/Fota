import React, { Component } from 'react';
import { Text, Image, View, Modal } from 'react-native';
import RestaurantDetail from './RestaurantDetail';

class RestaurantListing extends Component {
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
          <View style={{ flex: 1, paddingTop: 15 }}>
            <RestaurantDetail
              restaurant={this.props.restaurant}
              close={this.closeModal.bind(this)}
            />
          </View>
        </Modal>

        <View style={{ flexDirection: 'row', padding: 10 }}>
          <Image
            source={this.props.restaurant.link}
            style={{ width: 10, height: 10 }}
          />
          <Text onPress={() => this.setModalVisible(true)}>
            {this.props.restaurant.name}
          </Text>
        </View>
      </View>
    );
  }
}

export default RestaurantListing;
