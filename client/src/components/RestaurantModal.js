import React, { Component } from 'react';
import { View, Modal, Navigator, TouchableWithoutFeedback } from 'react-native';
import RestaurantDetail from './RestaurantDetail';
import CommentUpload from './CommentUpload';

class RestaurantModal extends Component {
  state = { modalVisible: false }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  renderScene(route, navigator) {
    switch (route.id) {
      case 0:
        return (
          <RestaurantDetail
            navigator={navigator}
            restaurant={this.props.restaurant}
            close={this.closeModal.bind(this)}
          />
        );
      case 1:
        return (
          <CommentUpload
            restaurant={this.props.restaurant}
            navigator={navigator}
          />
        );
      default:
        return (
          <RestaurantDetail
            navigator={navigator}
            restaurant={this.props.restaurant}
            close={this.closeModal.bind(this)}
          />
        );
    }
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
              <Navigator
                style={{ flex: 1, backgroundColor: '#fff' }}
                initialRoute={{ id: 0 }}
                renderScene={this.renderScene.bind(this)}
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
