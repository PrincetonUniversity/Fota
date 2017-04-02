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

class PhotoDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { link: props.photo.link,
                    likecount: props.photo.likecount,
                    userLiked: false,
                    userDisliked: false,
                    upvoteSource: require('../img/upvote_unactivated.png'),
                    downvoteSource: require('../img/downvote_unactivated.png'),
                    userHasVoted: false
                  };
  }
  render() {
    return (
      <Card>
        <CardSection>
            <ImageButton
                style={photoStyle}
                source={{ uri: this.state.link }}
                onPress={() => console.log('pressed')}
            />
        </CardSection>

        <CardSection>
          <View style={likeCountContainerStyle}>
              <Image
                  source={require('../img/upvote_activated.png')}
                  style={likeCountArrowStyle}
              />
              <Text style={likeCountTextStyle}>{this.state.likecount}</Text>
          </View>

          <View style={likeContainerStyle}>
            <ImageButton
                source={this.state.upvoteSource}
                style={voteStyle}
                onPress={() => {
                  var newLikeCount = this.state.likecount;
                  if (!this.state.userHasVoted) {
                    newLikeCount += 1;
                  } else if (this.state.userDisliked) {
                      newLikeCount += 2;
                  }
                  this.setState({ likecount: newLikeCount,
                                  userLiked: true,
                                  userDisliked: false,
                                  userHasVoted: true,
                                  upvoteSource: require('../img/upvote_activated.png'),
                                  downvoteSource: require('../img/downvote_unactivated.png')
                                });
                  }
                }
            />
            <ImageButton
                source={this.state.downvoteSource}
                style={voteStyle}
                onPress={() => {
                  var newLikeCount = this.state.likecount;
                  if (!this.state.userHasVoted) {
                    newLikeCount -= 1;
                  } else if (this.state.userLiked) {
                      newLikeCount -= 2;
                  }
                  this.setState({ likecount: newLikeCount,
                                  userLiked: false,
                                  userDisliked: true,
                                  userHasVoted: true,
                                  upvoteSource: require('../img/upvote_unactivated.png'),
                                  downvoteSource: require('../img/downvote_activated.png')
                                });
                  }
                }
            />
          </View>
        </CardSection>
      </Card>
    );
  }
}

export default PhotoDetail;
