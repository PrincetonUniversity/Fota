import React, { Component } from 'react';
import { Text, View, ScrollView, Navigator, Modal, TouchableHighlight } from 'react-native';
import Headbar from './Headbar';
import PhotoList from './PhotoList';
import RestaurantDetail from './RestaurantDetail';
import { footerSize } from './common/Footer';

class HomePage extends Component {
  state = { modalVisible: true };

  // setModalVisible(visible) {
  //   this.setState({ modalVisible: visible });
  // }

  // renderScene(route, navigator) {
  //   switch (route.name) {
  //     case 'Photo List':
  //       console.log(this);
  //       this.setModalVisible(false);
  //       return (
  //         <ScrollView style={{ marginBottom: footerSize }}>
  //           <Headbar />
  //           <PhotoList navigator={navigator} />
  //         </ScrollView>
  //       );
  //     case 'Restaurant Page':
  //       return (
  //         <Modal
  //           animationType={'fade'}
  //           transparent
  //           visible={true}
  //           onRequestClose={() => { this.setModalVisible(false); }}
  //         >
  //           <View style={{ flex: 1 }}>
  //             <RestaurantDetail restaurant={route.restaurant} navigator={navigator} />
  //           </View>
  //         </Modal>
  //       );
  //     default:
  //       return (
          // <ScrollView style={{ marginBottom: footerSize }}>
          //   <Headbar />
          //   <PhotoList navigator={navigator} />
          // </ScrollView>
  //       );
  //   }
  // }
  /*<TouchableHighlight
    onPress={() => {
      this.setModalVisible(!this.state.modalVisible);
    }}
  >
    <Text>Hide Modal</Text>
  </TouchableHighlight>*/

  render() {
    return (
      <ScrollView style={{ marginBottom: footerSize }}>
        <Headbar />
        <PhotoList />
      </ScrollView>
    );
  }
}

export default HomePage;
