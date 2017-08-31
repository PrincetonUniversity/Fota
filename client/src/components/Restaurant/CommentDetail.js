/******************************************************************************
 * Called by: ./RestaurantDetail
 * Dependencies: ./NounDetail, common/CommentDisplay
 *
 * Description: Displays the reviews on the restaurant page. Tapping a review
 * will bring up ./NounDetail, showing the percentage breakdown for the different
 * adjectives used with the noun from the review.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Entypo';
import Ionicon from 'react-native-vector-icons/Ionicons';
import request from '../../helpers/axioshelper';
import { commentVote } from '../../helpers/URL';

class CommentDetail extends Component {
  constructor(props) {
    super(props);
    if (!props.vote) {
      this.state = {
        votecount: props.comment.vote_count,
        id: props.comment.id,
        userLiked: false,
        userDisliked: false,
        userHasVoted: false,
      };
    } else if (props.vote === 'liked') {
      this.state = {
        votecount: props.comment.vote_count,
        id: props.comment.id,
        userLiked: true,
        userDisliked: false,
        userHasVoted: true,
      };
    } else if (props.vote === 'disliked') {
      this.state = {
        votecount: props.comment.vote_count,
        id: props.comment.id,
        userLiked: false,
        userDisliked: true,
        userHasVoted: true,
      };
    }
  }

  sendUpdateRequest(type) {
    request.patch(commentVote(this.state.id, type))
    .catch(e => request.showErrorAlert(e));
  }

  renderUpvote() {
    let newVoteCount = this.state.votecount;
    let userNewLike = true;
    let userVoted = true;
    if (!this.state.userHasVoted) {
      newVoteCount += 1;
      this.sendUpdateRequest('up');
    } else if (this.state.userDisliked) {
        newVoteCount += 2;
        this.sendUpdateRequest('up');
    } else if (this.state.userLiked) {
        newVoteCount -= 1;
        userNewLike = false;
        userVoted = false;
        this.sendUpdateRequest('clear');
    }
    this.setState({
      votecount: newVoteCount,
      userLiked: userNewLike,
      userDisliked: false,
      userHasVoted: userVoted,
    });
  }

  renderDownvote() {
    let newVoteCount = this.state.votecount;
    let userHasDisliked = true;
    let userVoted = true;
    if (!this.state.userHasVoted) {
      newVoteCount -= 1;
      this.sendUpdateRequest('down');
    } else if (this.state.userLiked) {
      newVoteCount -= 2;
      this.sendUpdateRequest('down');
    } else if (this.state.userDisliked) {
      newVoteCount += 1;
      userHasDisliked = false;
      userVoted = false;
      this.sendUpdateRequest('clear');
    }
    this.setState({
      votecount: newVoteCount,
      userLiked: false,
      userDisliked: userHasDisliked,
      userHasVoted: userVoted,
    });
  }

  renderEditButton(render) {
    if (render) {
      return (
        <TouchableOpacity
          onPress={() => console.log('can\'t edit yet!')}
        >
          <Text style={headingTextStyle}>Edit</Text>
        </TouchableOpacity>
      );
    }
    return <View />;
  }

  render() {
    const comment = this.props.comment;
    const upvoteColor = this.state.userLiked ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.15)';
    const downvoteColor = this.state.userDisliked ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.15)';

    return (
      <TouchableOpacity activeOpacity={1}>
        <View style={containerStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            {comment.my_comment && <Text style={youTextStyle}>(You) </Text>}
            <Text style={headingTextStyle}>{comment.author}</Text>
            <Icon name='dot-single' size={13} color='rgba(0, 0, 0, 0.3)' style={{ marginHorizontal: 5 }} />
            <Text style={headingTextStyle}>Undecided</Text>
            <Icon name='dot-single' size={13} color='rgba(0, 0, 0, 0.3)' style={{ marginHorizontal: 5 }} />
            <Text style={headingTextStyle}>{moment(comment.uploaded_at).fromNow()}</Text>
          </View>

          <Text style={messageStyle}>{comment.message}</Text>

          <View style={bottomBarStyle}>
            {this.renderEditButton(comment.my_comment)}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

              <Text style={voteCountStyle}>
                {this.state.votecount.toString()}
              </Text>
              <TouchableOpacity onPress={() => this.renderDownvote()}>
                <Ionicon
                  name='ios-arrow-down'
                  size={24}
                  color={downvoteColor}
                  backgroundColor='transparent'
                  style={{ marginHorizontal: 10 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.renderUpvote()}>
                <Ionicon
                  name='ios-arrow-up'
                  size={24}
                  color={upvoteColor}
                  backgroundColor='transparent'
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    padding: 20, 
    flexDirection: 'column',
    backgroundColor: 'white',
    borderColor: 'rgba(0, 0, 0, 0.06)',
    borderBottomWidth: 1
  },
  youTextStyle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ff9700'
  },
  headingTextStyle: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(0, 0, 0, 0.3)'
  },
  messageStyle: {
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.8)',
    fontWeight: '300',
  },
  bottomBarStyle: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5
  },
  voteCountStyle: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.15)',
    fontWeight: '900'
  }
};

const {
  containerStyle,
  youTextStyle,
  headingTextStyle,
  messageStyle,
  bottomBarStyle,
  voteCountStyle
} = styles;

export default CommentDetail;
