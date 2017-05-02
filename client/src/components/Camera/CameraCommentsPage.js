import React, { Component } from 'react';
import { View, Image, Text, FlatList, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import { RNS3 } from 'react-native-aws3';
import { Header, CommentDisplay } from '../common';
import { deleteImage } from './CameraPage';
import { setCameraState } from '../../actions';

const styles = {
  pageStyle: {
    flex: 1,
    flexDirection: 'column'
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
};

const { pageStyle,
        headerTextStyle,
        imageStyle,
      } = styles;

const commentDetails = 'https://fotafood.herokuapp.com/api/comment/13'; // HARD CODED

class CameraCommentsPage extends Component {
  constructor(props) {
    super(props);
    this.state = { uploadPath: null, restaurantid: null, presetComments: [], adjective: '', noun: '', comments: [] };
    this.submitting = false;
  }

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
    if (this.submitting) {
      return;
    }
    this.submitting = true;

    const file = {
      uri: this.state.uploadPath,
      name: `${this.props.loginState.uid}_${this.state.restaurantid}_${this.state.uploadPath.split('/').pop()}.jpg`,
      type: 'image/jpg'
    };

    const options = {
      keyPrefix: '/',
      bucket: 'fota-app',
      region: 'us-east-1',
      accessKey: 'AKIAJZT4VGQAIPGA4QTA',
      secretKey: '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',
      successActionStatus: 201
    };

    RNS3.put(file, options).then(response => {
      if (response.status !== 201) {
        return;
      }
      axios.post('https://fotafood.herokuapp.com/api/photo', {
        RestaurantId: this.state.restaurantid,
        UserId: this.props.loginState.uid,
        link: response.body.postResponse.location // this should be the aws link
      })
        .then(() => {
          deleteImage(this.state.uploadPath);
          AsyncStorage.setItem('UploadRestaurant', '');
          AsyncStorage.setItem('UploadPath', '');
          // this.props.navigator.resetTo({ id: 0 });
          this.props.setCameraState(false);
        })
        .catch(error => console.log(error));
    });
  }

  renderCameraLocation() {
    this.props.navigator.replace({ id: 1 });
  }

  renderComment(comment) {
    const adj = comment.adj.charAt(0).toUpperCase() + comment.adj.slice(1);
    const noun = comment.noun.charAt(0).toUpperCase() + comment.noun.slice(1);
    const commentString = `${adj} ${noun}`;
    return (
      <CommentDisplay
        key={commentString}
        text={commentString}
      />
    );
  }

  render() {
    if (this.state.uploadPath) {
      return (
        <View style={pageStyle}>
          <Header>
            <Text
              style={headerTextStyle}
              onPress={() => {
                AsyncStorage.setItem('UploadRestaurant', '');
                this.renderCameraLocation();
              }}
            >
              Back
            </Text>

            <Text
              style={headerTextStyle}
              onPress={() => this.submitUpload()}
            >
              Submit
            </Text>
          </Header>

          <View style={{ alignItems: 'center' }}>
            <Image
              source={{ uri: this.state.uploadPath }}
              style={imageStyle}
            />
          </View>

          <View>
            {/* {this.renderComments()} */}
          </View>

          <View style={{ alignItems: 'center' }}>
            <FlatList
              data={this.state.presetComments}
              keyExtractor={comment => comment.id}
              renderItem={comment => this.renderComment(comment.item)}
              numColumns={2}
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

function mapStateToProps({ loginState }) {
  return { loginState };
}

export default connect(mapStateToProps, { setCameraState })(CameraCommentsPage);
