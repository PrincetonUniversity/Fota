import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import { Card, CardSection, ImageButton } from './common';

const styles = {
  photoStyle: { // The picture
    height: 300,
    flex: 1,
    width: null
  },
  voteStyle: { // Upvote/downvote
    height: 25,
    width: 25
  },
  likeCountContainerStyle: { // Upvote arrow + number of likes container
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10
  },
  likeCountArrowStyle: { // the arrow next to number of likes
    height: 15,
    width: 15
  },
  likeCountTextStyle: { // Number of likes
    fontSize: 15,
    textAlign: 'justify',
    fontWeight: 'bold',
    marginLeft: 5
  },
  likeContainerStyle: { // Upvote/downvote container
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginRight: 10
  },
};

const { photoStyle,
        voteStyle,
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
                    userLiked: false,
                    userDisliked: false,
                    upvoteSource: upvoteUnactivated,
                    downvoteSource: downvoteUnactivated,
                    userHasVoted: false
                  };
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
                  source={upvoteActivated}
                  style={likeCountArrowStyle}
              />
              <Text style={likeCountTextStyle}>{this.state.likecount}</Text>
          </View>

          <View style={likeContainerStyle}>
            <ImageButton
                source={this.state.upvoteSource}
                style={voteStyle}
                onPress={() => this.renderUpvote()}
            />
            <ImageButton
                source={this.state.downvoteSource}
                style={voteStyle}
                onPress={() => this.renderDownvote()}
            />
          </View>
        </CardSection>
      </Card>
    );
  }
}

export default PhotoDetail;
