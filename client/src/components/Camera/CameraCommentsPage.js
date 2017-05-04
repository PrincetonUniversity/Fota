import React, { Component } from 'react';
import { View,
          Image,
          Text,
          FlatList,
          AsyncStorage,
          TouchableOpacity,
          ScrollView,
          Alert
        } from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import { RNS3 } from 'react-native-aws3';
import { ImageButton, Header, CommentDisplay, CommentDisplayInput } from '../common';
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
  commentTextInputStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 4
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
        commentTextInputStyle,
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
    this.state = {
      uploadPath: null,
      restaurantid: null,
      adjective: '',
      noun: '',
      comments: [],
      newAdjective: '',
      newNoun: ''
    };
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
// Set the selected adjective
  setAdjective(adjective) {
    if (/^[a-z]+$/i.test(adjective)) {
      let cleanAdj = adjective.toLowerCase();
      cleanAdj = cleanAdj.charAt(0).toUpperCase() + cleanAdj.slice(1);
      this.setState({ adjective: cleanAdj });
    }
  }

// Set the selected noun
  setNoun(noun) {
    if (/^[a-z]+$/i.test(noun)) {
      let cleanNoun = noun.toLowerCase();
      cleanNoun = cleanNoun.charAt(0).toUpperCase() + cleanNoun.slice(1);
      this.setState({ noun: cleanNoun });
    }
  }

  updateNewAdjective(newAdjective) {
    this.setState({ newAdjective });
  }

  updateNewNoun(newNoun) {
    this.setState({ newNoun });
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
          this.props.setCameraState(false);
        })
        .catch(error => {
          deleteImage(this.state.uploadPath);
          console.log(error.response.status === 400);
          if (error.response.status === 400) {
            console.log('bad photo');
            Alert.alert(
              'Invalid Photo',
              'You may have uploaded an invalid photo. Please make sure you submit a picture of food.',
              [
                { text: 'OK', onPress: () => { this.props.navigator.replace({ id: 0 }); } }
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

// Render the bar containing all selected comments
  renderCommentsInput() {
    if (this.state.comments.length !== 0 || this.state.adjective !== '' || this.state.noun !== '') {
      return (
        <ScrollView
          style={uploadContainerStyle}
          horizontal
          bounces={false}
        >
          {this.renderAllComments()}
          {this.renderSingleComment(this.state.adjective, 0)}
          {this.renderSingleComment(this.state.noun, 1)}
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

// Visuall rendering all comments
  renderAllComments() {
    return this.state.comments.map(comment =>
      this.renderSingleComment(comment, 2)
    );
  }

// Rendering a single comment with type.
// type === 0: adjective, type === 1: noun, type === 2: comment
  renderSingleComment(comment, type) {
    if (comment) {
      return (
        <CommentDisplay
          key={comment}
          text={comment}
        >
          <ImageButton
            style={deleteCommentStyle}
            source={backButton}
            onPress={() => this.deleteComment(comment, type)}
          />
        </CommentDisplay>
      );
    }
    return;
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
            {this.renderCommentsInput()}
          </View>

          <View style={commentTextInputStyle}>
            <View style={{ flex: 1 }} />

            <View style={{ flex: 2, height: 34 }}>
              <CommentDisplayInput
                value={this.state.newAdjective}
                placeholder='Adjective'
                onChangeText={adjective => this.updateNewAdjective(adjective)}
                onSubmitEditing={() => {
                  this.setAdjective(this.state.newAdjective);
                  this.setState({ newAdjective: '' });
                }}
              />
            </View>

            <View style={{ flex: 2 }}>
              <CommentDisplayInput
                value={this.state.newNoun}
                placeholder='Noun'
                onChangeText={noun => this.updateNewNoun(noun)}
                onSubmitEditing={() => {
                  this.setNoun(this.state.newNoun);
                  this.setState({ newNoun: '' });
                }}
              />
            </View>

            <View style={{ flex: 1 }} />
          </View>

          <View style={commentOptionStyle}>
            <View style={{ flex: 1 }} />

            <View style={{ flex: 2 }}>
              <FlatList
                data={adjectives}
                keyExtractor={(index) => index.toString()}
                renderItem={adjective => this.renderAdjective(adjective.item)}
              />
            </View>

            <View style={{ flex: 2 }}>
              <FlatList
                data={nouns}
                keyExtractor={(index) => index.toString()}
                renderItem={noun => this.renderNoun(noun.item)}
              />
            </View>

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
