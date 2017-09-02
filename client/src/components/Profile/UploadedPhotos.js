import React, { Component } from 'react';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { NotFoundText, Spinner } from '../common';
import PhotoList from '../Photo/PhotoList';
import icoMoonConfig from '../../selection.json';

const Icon = createIconSetFromIcoMoon(icoMoonConfig);

class UploadedPhotos extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused }) => {
      let color = 'rgba(0,0,0,0.21)';
      if (focused) {
        color = '#ff9700';
      }
      return (
        <Icon
          name={'upload_profile'}
          color={color}
          size={21}
        />
      );
    }
  };

  render() {
    if (this.props.screenProps.loading) return <Spinner size='large' />;    
    if (this.props.screenProps.uploaded.length === 0) {
      return <NotFoundText text='Take your first photo to see it here!' />;
    }
    return <PhotoList list={this.props.screenProps.uploaded} />;
  }
}

export default UploadedPhotos;
