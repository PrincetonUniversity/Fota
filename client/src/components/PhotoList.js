import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import Headbar from './Headbar';
import PhotoDetail from './PhotoDetail';
import { footerSize } from './common/Footer';

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
        <ScrollView style={{ marginBottom: footerSize }}>
          <Headbar />
          <Spinner visible={this.state.spinnerVisible} color="#ff9700" />
          {this.renderPhotos()}
        </ScrollView>
    );
  }
}

export default PhotoList;
