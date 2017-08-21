import React, { Component } from 'react';
import PhotoList from '../Photo/PhotoList';

class UploadedPhotos extends Component {
  render() {
    return <PhotoList list={this.props.screenProps.uploaded} />;
  }
}

export default UploadedPhotos;
