import React, { Component } from 'react';
import { Text, FlatList, CameraRoll, Dimensions, Platform } from 'react-native';
import { ImageButton } from '../common';
import { tabStyle } from './CameraPage';

const imageSize = Dimensions.get('window').width / 4;

class CameraLibrary extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    tabBarIcon: ({ focused }) => {
      let color = '#ccc';
      if (focused) color = '#ff9700';
      return (
          <Text
            onPress={() => {
              if (!focused) {
                screenProps.showCamera(false);
                navigation.navigate('Library');
              } 
            }}
            style={{ color, ...tabStyle }}
          >
            LIBRARY
          </Text>
      );
    }
  });

  state = { photos: [] };

  componentWillMount() {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    }).then(r => {
      if (Platform.OS === 'android') {
        const RNGRP = require('react-native-get-real-path');
        
        const promises = r.edges.map(p => {
          return RNGRP.getRealPathFromURI(p.node.image.uri).then(filePath => filePath);
        });
        Promise.all(promises).then(results => {
          const uris = results.map(uri => `file://${uri}`);
          this.setState({ photos: uris });
        });
      } else {
        const uris = r.edges.map(p => p.node.image.uri);
        this.setState({ photos: uris });
      }
    });
  }

  renderPhoto(uri) {
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
        keyExtractor={photo => photo}
        renderItem={photo => this.renderPhoto(photo.item)}
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
