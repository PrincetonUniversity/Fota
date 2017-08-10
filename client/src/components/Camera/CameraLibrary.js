import React, { Component } from 'react';
import { FlatList, CameraRoll, Dimensions } from 'react-native';
import { ImageButton } from '../common';

const imageSize = 100;

class CameraLibrary extends Component {
  state = { photos: [] };

  componentWillMount() {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos'
    })
    .then(r => this.setState({ photos: r.edges }));
  }

  renderPhoto(uri) {
    console.log(uri);
    return (
      <ImageButton
        source={{ uri }}
        style={{ width: imageSize, height: imageSize }}
        onPress={() => this.props.screenProps.choosePhoto(uri)}
      />
    );
  }

  render() {
    return (
      <FlatList
        data={this.state.photos}
        keyExtractor={photo => photo.node.image.uri}
        renderItem={photo => this.renderPhoto(photo.item.node.image.uri)}
        bounces={false}
        removeClippedSubviews={false}
        getItemLayout={(data, index) => (
          { length: imageSize, offset: imageSize * index, index }
        )}
        numColumns={4}
      />
    );
  }
}

export default CameraLibrary;
