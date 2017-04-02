import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import axios from 'axios';
import Headbar from './Headbar';
import PhotoDetail from './PhotoDetail';
import { footerSize } from './common/Footer';

class PhotoList extends Component {
  state = { photos: [], restaurants: [] }

  componentWillMount() {
      axios.get('https://fotafood.herokuapp.com/api/photo?order=hot&lat=55.1234&lng=-123.551')
          .then(response => this.setState({ photos: response.data.photos,
                                            restaurants: response.data.restaurants }));
  }

  renderPhotos() {
      return this.state.photos.map(photo =>
          <PhotoDetail key={photo.id} photo={photo} />
          // Later on key should be id of user who uploaded it
      );
  }

  render() {
    return (
        <ScrollView style={{ marginBottom: footerSize }}>
          <Headbar />
          {this.renderPhotos()}
        </ScrollView>
    );
  }
}

export default PhotoList;
