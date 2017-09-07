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
import { View, Text, TouchableOpacity, LayoutAnimation, UIManager, TextInput, Platform, Alert } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Entypo';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Spinner } from '../common';
import request from '../../helpers/axioshelper';
import { commentEdit, commentVote } from '../../helpers/URL';

class CommentDetail extends Component {
  constructor(props) {
    super(props);
    if (!props.vote) {
      this.state = {
        message: props.comment.message,
        votecount: props.comment.vote_count,
        id: props.comment.id,
        userLiked: false,
        userDisliked: false,
        userHasVoted: false,
        isEditing: false,
        submitting: false
      };
    } else if (props.vote === 'liked') {
      this.state = {
        message: props.comment.message,
        votecount: props.comment.vote_count,
        id: props.comment.id,
        userLiked: true,
        userDisliked: false,
        userHasVoted: true,
        isEditing: false,
        submitting: false
      };
    } else if (props.vote === 'disliked') {
      this.state = {
        message: props.comment.message,
        votecount: props.comment.vote_count,
        id: props.comment.id,
        userLiked: false,
        userDisliked: true,
        userHasVoted: true,
        isEditing: false,
        submitting: false
      };
    }
    this.timer = null;
    this.oldValue = null;
    this.oldHeight = 0;
    this.heightHasBeenAdded = false;
    this.submitting = false;
    this.oldMessage = props.comment.message;
  }

  componentWillMount() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  componentWillUnmount() {
    this.props.subtractHeight(this.oldHeight);
  }

  sendUpdateRequest(type) {
    const patch = () => {
      const temp = this.oldValue;
      this.timer = null;
      this.oldValue = null;
      if (temp === type) return;
      request.patch(commentVote(this.state.id, type))
      .catch(e => request.showErrorAlert(e));
    };
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(patch, 600);
  }

  changeComment() {
    if (this.submitting) return;
    this.submitting = true;
    this.setState({ submitting: true });
    request.patch(commentEdit(this.state.id), {
      message: this.state.message
    })
    .then(() => {
      this.submitting = false;
      this.setState({ isEditing: false, submitting: false });
    })
    .catch(e => {
      this.submitting = false;
      this.setState({ isEditing: false, submitting: false });
      request.showErrorAlert(e);
    });
  }

  showDeleteAlert() {
    Alert.alert(
      'Delete Comment',
      'Do you want to delete this comment?',
      [
        { text: 'Cancel' },
        { text: 'Delete', onPress: () => this.deleteComment() }
      ]
    );
  }

  deleteComment() {
    request.delete(commentEdit(this.state.id))
    .then(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.props.deleteComment(this.state.id, this.oldHeight);
    })
    .catch(e => {
      request.showErrorAlert(e);
    });
  }

  renderUpvote() {
    let newVoteCount = this.state.votecount;
    let userNewLike = true;
    let userVoted = true;
    if (!this.state.userHasVoted) {
      newVoteCount += 1;
      if (this.oldValue == null) this.oldValue = 'clear';
      this.sendUpdateRequest('up');
    } else if (this.state.userDisliked) {
        newVoteCount += 2;
        if (this.oldValue == null) this.oldValue = 'down';
        this.sendUpdateRequest('up');
    } else if (this.state.userLiked) {
        newVoteCount -= 1;
        userNewLike = false;
        userVoted = false;
        if (this.oldValue == null) this.oldValue = 'up';
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
      if (this.oldValue == null) this.oldValue = 'clear';
      this.sendUpdateRequest('down');
    } else if (this.state.userLiked) {
      newVoteCount -= 2;
      if (this.oldValue == null) this.oldValue = 'up';
      this.sendUpdateRequest('down');
    } else if (this.state.userDisliked) {
      newVoteCount += 1;
      userHasDisliked = false;
      userVoted = false;
      if (this.oldValue == null) this.oldValue = 'down';
      this.sendUpdateRequest('clear');
    }
    this.setState({
      votecount: newVoteCount,
      userLiked: false,
      userDisliked: userHasDisliked,
      userHasVoted: userVoted,
      expanded: false
    });
  }

  renderMessageAndFooter(comment) {
    const upvoteColor = this.state.userLiked ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.15)';
    const downvoteColor = this.state.userDisliked ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.15)';

    if (this.state.isEditing) {
      return (
        <TouchableOpacity activeOpacity={1}>
          <View style={editBoxStyle}>
            <TextInput
              autoFocus
              style={editorStyle}
              value={this.state.message}
              placeholder='Add a review...'
              placeholderTextColor='rgba(0,0,0,0.31)'
              multiline
              /* onFocus={() => this.setState({ isEditing: true })}
              onBlur={() => {
                if (this.state.message === this.oldMessage) {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  this.setState({ isEditing: false });
                }
              }} */
              onChangeText={message => {
                this.setState({ message });
              }}
              underlineColorAndroid={'transparent'}
              autoCapitalize={'sentences'}
            />
          </View>
          {this.renderEditFooter()}
        </TouchableOpacity>
      );
    }
    let numberOfLines = 4;
    if (this.state.expanded) {
      numberOfLines = null;
    }
    return (
      <View>
        <Text
          style={messageStyle}
          numberOfLines={numberOfLines}
          suppressHighlighting
          onPress={() => {
            this.setState({ expanded: !this.state.expanded });
          }}
        >
          {this.state.message}
        </Text>

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
    );
  }

  renderEditFooter() {
    if (this.state.isEditing) {
      return (
        <View style={editFooterContainerStyle}>
          {this.renderCancelButton()}
          {this.renderDoneButton()}
        </View>
      );
    }
  }

  renderCancelButton() {
    return (
      <TouchableOpacity
        onPress={() => this.setState({ isEditing: false, message: this.oldMessage })}
      >
        <View style={{ width: 75, height: 20 }}>
          <Text style={{ color: 'rgba(0, 0, 0, 0.3)', fontSize: 15, fontWeight: '900' }}>CANCEL</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderDoneButton() {
    if (this.state.submitting) {
      return <View style={editFooterButtonStyle}><Spinner size="small" /></View>;
    }
    let color = 'rgba(0, 0, 0, 0.3)';
    let action = () => { this.setState({ isEditing: false }); };
    if (this.state.message !== this.oldMessage && this.state.message.length > 0) {
      color = '#2494ff';
      action = () => this.changeComment();
    }
    return (
      <TouchableOpacity onPress={action}>
        <View style={{ width: 50, height: 20 }}>
          <Text style={{ color, fontSize: 15, fontWeight: '900' }}>DONE</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderEditButton(isMyComment) {
    if (isMyComment) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => this.setState({ isEditing: true })}
          >
            <Text style={headingTextStyle}>Edit</Text>
          </TouchableOpacity>
          <Icon name='dot-single' size={13} color='rgba(0, 0, 0, 0.3)' style={{ marginHorizontal: 5 }} />
          <TouchableOpacity
            onPress={() => this.showDeleteAlert()}
          >
            <Text style={headingTextStyle}>Delete</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return <View />;
  }

  render() {
    const comment = this.props.comment;
    let recommendation = 'Undecided';
    if (comment.author_recommended_yes) recommendation = 'Recommended';
    if (comment.author_recommended_no) recommendation = 'Not Recommended';
    return (
      <TouchableOpacity activeOpacity={1}>
        <View
          style={containerStyle}
          onLayout={e => {
            const currentHeight = e.nativeEvent.layout.height;
            if (!this.heightHasBeenAdded) {
              this.heightHasBeenAdded = true;
              this.oldHeight = currentHeight;
              this.props.addHeight(currentHeight);
            } else {
              if (this.oldHeight !== currentHeight) {
                const diffHeight = currentHeight - this.oldHeight;
                this.oldHeight = currentHeight;
                this.props.changeHeight(diffHeight);
              }
            }
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            {comment.my_comment && <Text style={youTextStyle}>(You) </Text>}
            <Text style={headingTextStyle}>{comment.author}</Text>
            <Icon name='dot-single' size={13} color='rgba(0, 0, 0, 0.3)' style={{ marginHorizontal: 5 }} />
            <Text style={headingTextStyle}>{recommendation}</Text>
            <Icon name='dot-single' size={13} color='rgba(0, 0, 0, 0.3)' style={{ marginHorizontal: 5 }} />
            <Text style={headingTextStyle}>{moment(comment.uploaded_at).fromNow()}</Text>
          </View>

          {this.renderMessageAndFooter(comment)}


        </View>
      </TouchableOpacity>
    );
  }
}

const styles = {
  containerStyle: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderColor: 'rgba(0, 0, 0, 0.06)',
    borderBottomWidth: 1,
    zIndex: 5
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
    fontWeight: '300'
  },
  bottomBarStyle: {
    flexDirection: 'row',
    paddingBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 5,
    zIndex: 5
  },
  editBoxStyle: {
    backgroundColor: 'white',
    borderColor: 'rgba(0, 0, 0, 0.09)',
    borderWidth: 1,
    height: 90,
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 5
  },
  editorStyle: {
    padding: 0,
    color: 'rgba(0,0,0,0.75)',
    fontSize: 15,
    lineHeight: Platform.OS === 'android' ? 20 : 26,
    fontWeight: '400',
    flex: 1
  },
  editFooterContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
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
  editBoxStyle,
  editorStyle,
  editFooterContainerStyle,
  editFooterButtonStyle,
  voteCountStyle
} = styles;

export default CommentDetail;
