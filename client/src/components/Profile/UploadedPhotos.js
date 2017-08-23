import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PhotoList from '../Photo/PhotoList';

class UploadedPhotos extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused }) => {
      let color = '#ccc';
      if (focused) {
        color = '#ff9700';
      }
      return (
        <Icon
          name={'file-upload'}
          color={color}
          size={33}
        />
      );
    }
  };

  render() {
    return <PhotoList list={this.props.screenProps.uploaded} />;
  }
}

export default UploadedPhotos;
