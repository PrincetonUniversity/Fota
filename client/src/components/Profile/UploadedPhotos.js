import React, { Component } from 'react';
import { UIManager, LayoutAnimation } from 'react-native';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import PhotoList from '../Photo/PhotoList';
import { NotFoundText, Spinner } from '../common';
import request from '../../helpers/axioshelper';
import { photoDelete } from '../../helpers/URL';
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

  componentWillMount() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);    
  }

  deletePhoto(id) {
    request.delete(photoDelete(id)).then(() => {
      this.props.screenProps.updateWithDeletedPhoto(id);
    }).catch(e => request.showErrorAlert(e));
  }

  render() {
    if (this.props.screenProps.loading) return <Spinner size='large' />;    
    if (this.props.screenProps.uploaded.length === 0) {
      return <NotFoundText text='Take your first photo to see it here!' />;
    }
    return (
      <PhotoList 
        list={this.props.screenProps.uploaded} 
        onRefresh={this.props.screenProps.refreshPage}
        refreshing={this.props.screenProps.refreshing}
        options={[{
          name: 'Delete Photo',
          onClick: photoId => this.deletePhoto(photoId)
        }]}
      />
    );
  }
}

export default UploadedPhotos;
