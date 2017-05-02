import React, { Component } from 'react';
import { View,
          Image,
          Text,
          FlatList,
          AsyncStorage,
          TouchableOpacity,
          ScrollView
        } from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import { RNS3 } from 'react-native-aws3';
import { ImageButton, Header, CommentDisplay } from '../common';
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
  uploadContainerStyle: {
    height: 50, // FIGURE OUT HOW TO NOT HARD CODE THIS
    padding: 1,
    borderRadius: 10,
    backgroundColor: '#b2b2b2',
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 10
  },
  commentTextStyle: {
    color: 'white',
    fontFamily: 'Avenir',
    fontSize: 15,
    marginLeft: 7,
    opacity: 0.8
  },
  deleteCommentStyle: { // delete a selected comment
    width: 15,
    height: 15,
  },
  commentOptionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  }
};

const { pageStyle,
        headerTextStyle,
        imageStyle,
        uploadContainerStyle,
        commentTextStyle,
        deleteCommentStyle,
        commentOptionStyle
      } = styles;

const adjectives = ['Great', 'Good', 'OK', 'Bad'];
const nouns = ['Food', 'Ambience', 'Service', 'Atmosphere'];
const backButton = require('../../img/exit_button.png');

class CameraCommentsPage extends Component {
  constructor(props) {
    super(props);
    this.state = { uploadPath: null, restaurantid: null, adjective: '', noun: '', comments: [] };
    this.submitting = false;
  }

  componentDidMount() {
    AsyncStorage.getItem('UploadPath').then((path) => {
            this.setState({ uploadPath: path });
        }).done();
    AsyncStorage.getItem('UploadRestaurant').then((restaurantid) => {
            this.setState({ restaurantid });
        }).done();
  }

  componentDidUpdate() {
    this.addComment();
  }

// COMMENT CONTROL
// Set selected chosen adjective
  setAdjective(adjective) {
    this.setState({ adjective });
  }

// Set selected chosen noun
  setNoun(noun) {
    this.setState({ noun });
  }

// Add a comment to list of user's comment choices
  addComment() {
    const adj = this.state.adjective;
    const noun = this.state.noun;
    console.log(adj);
    const newComment = `${adj} ${noun}`;
    if (adj && noun) {
      if (this.state.comments.indexOf(newComment) === -1) {
        this.setState({
          adjective: '',
          noun: '',
          comments: this.state.comments.concat(`${adj} ${noun}`)
        });
      }
    }
  }

// Delete chosen comment from list of user's comment choices
  deleteComment(comment) {
    let comments = this.state.comments;
    const index = comments.indexOf(comment);
    comments.splice(index, 1);
    console.log(comments);
    this.setState({ comments });
  }

// Submit all comments
  submitComments() {
    if (this.state.comments.length === 0) {
      return;
    }
    this.state.comments.map(comment => this.submitComment(comment));
  }

// Helper function, submits a single comment
  submitComment(comment) {
    const words = comment.split(' ');
    const adj = words[0];
    const noun = words[1];
    axios.post('https://fotafood.herokuapp.com/api/comment', {
      noun,
      adj,
      rest: this.state.restaurantid
    })
      .catch(error => console.log(error));
  }

// Uploading the photo and comments
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
      this.submitComments(); // Do we need to do .then?
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
        .catch(error => {
          deleteImage(this.state.uploadPath);
          console.log(error.response.status === 400);
          if (error.response.status === 400) {
            console.log('bad photo');
            Alert.alert(
              'Invalid Photo',
              'You may have uploaded an invalid photo. Please make sure your submit a picture of food.',
              [
                { text: 'Okay', onPress: () => { this.props.navigator.replace({ id: 0 }); } }
              ]
          );
          }
        }
        );
    });
  }

  renderCameraLocation() {
    this.props.navigator.replace({ id: 1 });
  }

// List of selected comments
  renderComments() {
    if (this.state.comments.length !== 0) {
      return (
        <ScrollView
          style={uploadContainerStyle}
          horizontal
          bounces={false}
        >
          {this.renderComment()}
        </ScrollView>
      );
    }
    return (
      <View style={{ ...uploadContainerStyle, ...{ justifyContent: 'center' } }}>
        <Text style={commentTextStyle}>
          Say something about this restaurant...
        </Text>
      </View>
    );
  }

// Individual selected comment
  renderComment() {
    return this.state.comments.map(comment =>
      <CommentDisplay
        key={comment}
        text={comment}
      >
        <ImageButton
          style={deleteCommentStyle}
          source={backButton}
          onPress={() => this.deleteComment(comment)}
        />
      </CommentDisplay>
    );
  }

  renderAdjective(adjective) {
    return (
      <TouchableOpacity
        key={adjective}
        onPress={() => this.setAdjective(adjective)}
      >
        <CommentDisplay text={adjective} />
      </TouchableOpacity>
    );
  }

  renderNoun(noun) {
    return (
      <TouchableOpacity
        key={noun}
        onPress={() => this.setNoun(noun)}
      >
        <CommentDisplay text={noun} />
      </TouchableOpacity>
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
            {this.renderComments()}
          </View>

          <View style={commentOptionStyle}>
            <View style={{ flex: 1 }} />

            <FlatList
              data={adjectives}
              keyExtractor={index => index.toString()}
              renderItem={adjective => this.renderAdjective(adjective.item)}
              bounces={false}
            />
            <FlatList
              data={nouns}
              keyExtractor={index => index.toString()}
              renderItem={noun => this.renderNoun(noun.item)}
              bounces={false}
            />

            <View style={{ flex: 1 }} />
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
