import React, { Component } from 'react';
import { View, Image, Text, FlatList, AsyncStorage } from 'react-native';
import axios from 'axios';
import RNFetchBlob from 'react-native-fetch-blob';
import { Input, Header } from './common';

const styles = {
  pageStyle: {
    flex: 1,
    flexDirection: 'column'
  },
  headerStyle: {
    height: 40,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20
  },
  headerTextStyle: {
    fontSize: 15,
    fontFamily: 'Avenir'
  },
  imageStyle: {
    width: 150,
    height: 150,
    marginBottom: 10
  },
  containerStyle: {
    backgroundColor: '#ddd',
    marginHorizontal: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderRadius: 16,
    height: 32
  }
};

const { pageStyle,
        headerStyle,
        headerTextStyle,
        imageStyle,
        containerStyle
      } = styles;

class CameraLocationPage extends Component {
  state = { uploadPath: null, query: '', rlist: [], totalList: [] }

  componentWillMount() {
    axios.get('https://fotafood.herokuapp.com/api/restaurant')
      .then(response => this.setState({ totalList: response.data, rlist: response.data }));
  }

  componentDidMount() {
    AsyncStorage.getItem('UploadPath').then((path) => {
            this.setState({ uploadPath: path });
        }).done();
  }

  updateQuery(query) {
    let rlist = this.state.totalList;
    if (query !== '') {
      rlist = this.state.totalList.filter(restaurant =>
        restaurant.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    this.setState({ query, rlist });
  }

  deleteImage(photo) {
    const filepath = photo.replace(/^(file:)/, '');
    RNFetchBlob.fs.exists(filepath)
      .then((result) => {
        if (result) {
          return RNFetchBlob.fs.unlink(filepath)
            .catch((err) => console.log(err.message));
        }
      });
  }

  renderRestaurant(restaurant) {
    return (
      <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
        <Text
          style={{ fontFamily: 'Avenir', fontSize: 15 }}
          onPress={() => {
            AsyncStorage.setItem('UploadRestaurant', String(restaurant.item.id));
            this.renderUploadComments();
          }}
        >
          {restaurant.item.name}
        </Text>
      </View>
    );
  }

  renderCameraPage() {
    this.props.navigator.replace({ id: 0 });
  }

  renderUploadComments() {
    this.props.navigator.replace({ id: 2 });
  }

  render() {
    if (this.state.uploadPath) {
      return (
        <View style={pageStyle}>
          <View style={headerStyle}>
            <Text
              style={headerTextStyle}
              onPress={() => {
                this.deleteImage(this.state.uploadPath);
                AsyncStorage.setItem('UploadPath', '');
                this.renderCameraPage();
              }}
            >
              Cancel
            </Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <Image
              source={{ uri: this.state.uploadPath }}
              style={imageStyle}
            />
          </View>

          <Header>
            <Input
              style={containerStyle}
              placeholder='Where did you take this picture?'
              value={this.state.query}
              onChangeText={query => this.updateQuery(query)}
            />
          </Header>

          <View>
            <FlatList
              data={this.state.rlist}
              keyExtractor={restaurant => restaurant.id}
              renderItem={restaurant => this.renderRestaurant(restaurant)}
              bounces={false}
            />
          </View>
        </View>
      );
    }
    return ( // DO SOMETHING HERE
      <View style={{ flex: 1, backgroundColor: 'white' }} />
    );
  }
}

export default CameraLocationPage;
