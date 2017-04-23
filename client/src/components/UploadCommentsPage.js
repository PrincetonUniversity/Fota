import React, { Component } from 'react';
import { View, Image, Text, FlatList, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
// import { RNS3 } from 'react-native-aws3';
import { FilterDisplay } from './common';
import { setCameraState } from '../actions';

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
        imageStyle
      } = styles;

const commentDetails = 'https://fotafood.herokuapp.com/api/comment/13'; // HARD CODED

class UploadCommentsPage extends Component {
  state = { uploadPath: null, restaurantid: null, presetComments: [] }

  componentWillMount() {
    axios.get(commentDetails)
      .then(response => this.setState({ presetComments: response.data }));
  }

  componentDidMount() {
    AsyncStorage.getItem('UploadPath').then((path) => {
            this.setState({ uploadPath: path });
        }).done();
    AsyncStorage.getItem('UploadRestaurant').then((restaurantid) => {
            this.setState({ restaurantid });
        }).done();
  }

  submitUpload() {
    // const file = {
    //   uri: this.state.uploadPath,
    //   name: `${this.state.restaurantid}${this.state.uploadPath}.png`,
    //   type: 'image/png'
    // };
    //
    // const options = {
    //   keyPrefix: 'uploads/',
    //   bucket: 'fota-app',
    //   region: 'us-east-1',
    //   accessKey: 'your-access-key',
    //   secretKey: 'your-secret-key',
    //   successActionStatus: 201
    // }

    axios.post('https://fotafood.herokuapp.com/api/photo', {
      RestaurantId: this.state.restaurantid,
      UserId: 'S70QX1ob2RcTNxj2HXwk2BGFECC3',
      link: this.state.uploadPath // this should be the aws link
    })
      .then(response => {
        console.log(response);
        AsyncStorage.setItem('UploadRestaurant', '');
        AsyncStorage.setItem('UploadPath', '');
        this.props.navigator.replace({ id: 0 });
        this.props.setCameraState(false);
      })
      .catch(error => console.log(error));
  }

  renderUploadLocation() {
    this.props.navigator.replace({ id: 1 });
  }

  renderComment(comment) {
    const adj = comment.item.adj.charAt(0).toUpperCase() + comment.item.adj.slice(1);
    const noun = comment.item.noun.charAt(0).toUpperCase() + comment.item.noun.slice(1);
    const commentString = `${adj} ${noun}`;
    return (
      <FilterDisplay
        key={commentString}
        text={commentString}
      />
    );
  }

  render() {
    if (this.state.uploadPath) {
      return (
        <View style={pageStyle}>
          <View style={headerStyle}>
            <Text
              onPress={() => {
                AsyncStorage.setItem('UploadRestaurant', '');
                this.renderUploadLocation();
              }}
            >
              Back
            </Text>

            <Text
              onPress={() => this.submitUpload()}
            >
              Submit
            </Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <Image
              source={{ uri: this.state.uploadPath }}
              style={imageStyle}
            />
          </View>

          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <Text>
              Would you like to say something about the restaurant?
            </Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <FlatList
              data={this.state.presetComments}
              keyExtractor={comment => comment.id}
              renderItem={comment => this.renderComment(comment)}
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

export default connect(null, { setCameraState })(UploadCommentsPage);
