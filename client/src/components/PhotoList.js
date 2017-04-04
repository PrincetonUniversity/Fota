// List of all the photos in their visual component PhotoDetail

import React, { Component } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import PhotoDetail from './PhotoDetail';

class PhotoList extends Component {
  state = { photos: [], restaurants: [], spinnerVisible: true };

  componentWillMount() {
    axios.get('https://fotafood.herokuapp.com/api/photo?order=hot&lat=55.1234&lng=-123.551')
      .then(response => this.setState({ photos: response.data.photos,
                                        restaurants: response.data.restaurants,
                                        spinnerVisible: false }));
  }

  renderPhotos() {
    return this.state.photos.map(photo =>
      <PhotoDetail key={photo.id} photo={photo} />
      // Later on key should be id of user who uploaded it
    );
  }

  render() {
    return (
      <View>
        <Spinner visible={this.state.spinnerVisible} color='#ff9700' />
        {this.renderPhotos()}
      </View>
    );
  }
}

export default PhotoList;
