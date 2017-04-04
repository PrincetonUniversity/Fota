// Visual component for each photo, i.e. photo frame+upvote/downvote/upvote count

import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import axios from 'axios';
import { Card, CardSection, ImageButton } from './common';

const styles = {
  photoStyle: { // The picture
    height: 300,
    flex: 1,
    width: null
  },
  upvoteStyle: { // Upvote/downvote
    height: 30,
    width: 30
  },
  downvoteStyle: { // Downvote
    height: 30,
    width: 30,
    marginLeft: 10,
    marginRight: 10
  },
  likeCountContainerStyle: { // Upvote arrow + number of likes container
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10
  },
  likeCountArrowStyle: { // the arrow next to number of likes
    height: 13,
    width: 13
  },
  likeCountTextStyle: { // Number of likes
    fontFamily: 'Avenir',
    fontSize: 13,
    textAlign: 'justify',
    fontWeight: 'bold',
    marginLeft: 5
  },
  likeContainerStyle: { // Upvote/downvote container
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginRight: 20
  },
};

const { photoStyle,
        upvoteStyle,
        downvoteStyle,
        likeCountContainerStyle,
        likeCountArrowStyle,
        likeCountTextStyle,
        likeContainerStyle
     } = styles;

const upvoteUnactivated = require('../img/upvote_unactivated.png');
const upvoteActivated = require('../img/upvote_activated.png');
const downvoteUnactivated = require('../img/downvote_unactivated.png');
const downvoteActivated = require('../img/downvote_activated.png');

class PhotoDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { link: props.photo.link,
                    likecount: props.photo.likecount,
                    id: props.photo.id,
                    userLiked: false,
                    userDisliked: false,
                    upvoteSource: upvoteUnactivated,
                    downvoteSource: downvoteUnactivated,
                    userHasVoted: false
                  };
  }

  // Sends the update request to the fota server.
  // type can either be "downvote" or "upvote"
  sendUpdateRequest(type) {
    const queryString = `https://fotafood.herokuapp.com/api/photo/${this.state.id}?type=${type}`;
    axios.patch(queryString)
      .then()
      .catch((e) => { console.log(e); }); // LATER should notify user on failure
  }

  renderUpvote() {
    let newLikeCount = this.state.likecount;
    let userNewLike = true;
    let userVoted = true;
    let voteSource = upvoteActivated;
    if (!this.state.userHasVoted) {
      newLikeCount += 1;
    } else if (this.state.userDisliked) {
        newLikeCount += 2;
    } else if (this.state.userLiked) {
        newLikeCount -= 1;
        userNewLike = false;
        userVoted = false;
        voteSource = upvoteUnactivated;
    }
    this.sendUpdateRequest('upvote');
    this.setState({ likecount: newLikeCount,
                    userLiked: userNewLike,
                    userDisliked: false,
                    userHasVoted: userVoted,
                    upvoteSource: voteSource,
                    downvoteSource: downvoteUnactivated
                  });
  }

  renderDownvote() {
    let newLikeCount = this.state.likecount;
    let userHasDisliked = true;
    let userVoted = true;
    let voteSource = downvoteActivated;
    if (!this.state.userHasVoted) {
      newLikeCount -= 1;
    } else if (this.state.userLiked) {
      newLikeCount -= 2;
    } else if (this.state.userDisliked) {
      newLikeCount += 1;
      userHasDisliked = false;
      userVoted = false;
      voteSource = downvoteUnactivated;
    }
    this.sendUpdateRequest('downvote');
    this.setState({ likecount: newLikeCount,
                    userLiked: false,
                    userDisliked: userHasDisliked,
                    userHasVoted: userVoted,
                    upvoteSource: upvoteUnactivated,
                    downvoteSource: voteSource
                  });
  }

  render() {
    return (
      <Card>
        <CardSection>
            <ImageButton
                activeOpacity={1}
                style={photoStyle}
                source={{ uri: this.state.link }}
                onPress={() => console.log('pressed')}
            />
        </CardSection>

        <CardSection>
          <View style={likeCountContainerStyle}>
              <Image
                  source={upvoteUnactivated}
                  style={likeCountArrowStyle}
              />
              <Text style={likeCountTextStyle}>{this.state.likecount}</Text>
          </View>

          <View style={likeContainerStyle}>
            <ImageButton
                source={this.state.upvoteSource}
                style={upvoteStyle}
                onPress={() => this.renderUpvote()}
            />
            <ImageButton
                source={this.state.downvoteSource}
                style={downvoteStyle}
                onPress={() => this.renderDownvote()}
            />
          </View>
        </CardSection>
      </Card>
    );
  }
}

export default PhotoDetail;
