import React, { Component } from 'react';
import { View, Text, FlatList, CameraRoll, Dimensions, Platform } from 'react-native';
import { Spinner, ImageButton } from '../common';
import { tabStyle } from './CameraPage';

const imageSize = Dimensions.get('window').width / 4;

class CameraLibrary extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    tabBarIcon: ({ focused }) => {
      let color = 'rgba(0,0,0,0.23)';
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

  state = { photos: [], lastCursor: null, noMorePhotos: false, loadingMore: false };

  componentWillMount() {
    this.loadPhotos();
  }

  getMorePhotos() {
    if (!this.state.noMorePhotos) {
      if (!this.state.loadingMore) {
        this.setState({ loadingMore: true }, () => { this.loadPhotos(); });
      }
    }
  }

  loadPhotos() {
    const fetchParams = {
      first: 100,
      assetType: 'Photos'
    };
    if (this.state.lastCursor) {
      fetchParams.after = this.state.lastCursor;
    }
    CameraRoll.getPhotos(fetchParams).then(r => {
      const assets = r.edges;
      const loadingMore = false;
      let noMorePhotos = false;
      if (!r.page_info.has_next_page) {
        noMorePhotos = true;
      }
      let lastCursor = null;
      if (assets.length > 0) {
        lastCursor = r.page_info.end_cursor;
      }
      if (Platform.OS === 'android') {
        const RNGRP = require('react-native-get-real-path');

        const promises = r.edges.map(p => (
          RNGRP.getRealPathFromURI(p.node.image.uri).then(filePath => filePath)
        ));
        Promise.all(promises).then(results => {
          const uris = results.map(uri => `file://${uri}`);
          this.setState({ photos: this.state.photos.concat(uris), loadingMore, noMorePhotos, lastCursor });
        });
      } else {
        const uris = r.edges.map(p => p.node.image.uri);
        this.setState({ photos: this.state.photos.concat(uris), loadingMore, noMorePhotos, lastCursor });
      }
    }).catch(e => console.log(e));
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

  renderSpinner() {
    if (this.state.loadingMore) {
      return (
        <View style={{ height: 50, alignItems: 'center', justifyContent: 'center' }}>
          <Spinner size='large' color='black' />
        </View>
      );
    }
    return <View />;
  }

  render() {
    return (
      <FlatList
        data={this.state.photos}
        keyExtractor={photo => photo}
        renderItem={photo => this.renderPhoto(photo.item)}
        bounces={false}
        onEndReachedThreshold={0.5}
        onEndReached={() => this.getMorePhotos()}
        removeClippedSubviews={false}
        ListFooterComponent={() => this.renderSpinner()}
        getItemLayout={(data, index) => (
          { length: imageSize, offset: imageSize * index, index }
        )}
        numColumns={4}
        style={{ backgroundColor: 'white' }}
      />
    );
  }
}

export default CameraLibrary;
