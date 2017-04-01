import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import axios from 'axios';
import PhotoDetail from './PhotoDetail';

class PhotoList extends Component {
    state = { photos: [] }

    componentWillMount() {
        axios.get('https://fotafood.herokuapp.com/photo') //  https://rallycoding.herokuapp.com/api/music_albums
            .then(response => this.setState({ photos: response.data }));
    }

    renderPhotos() {
        return this.state.photos.map(photo =>
            <PhotoDetail key={photo.id} photo={photo} />
            // Later on key should be id of user who uploaded it
        );
    }

    render() {
        return (
            <ScrollView>
                {this.renderPhotos()}
            </ScrollView>
        );
    }
}

export default PhotoList;
