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
import { View, Text, TouchableOpacity, LayoutAnimation, UIManager, TextInput } from 'react-native';
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
        isEditing: false
      };
    } else if (props.vote === 'liked') {
      this.state = {
        votecount: props.comment.vote_count,
        id: props.comment.id,
        userLiked: true,
        userDisliked: false,
        userHasVoted: true,
        isEditing: false
      };
    } else if (props.vote === 'disliked') {
      this.state = {
        votecount: props.comment.vote_count,
        id: props.comment.id,
        userLiked: false,
        userDisliked: true,
        userHasVoted: true,
        isEditing: false
      };
    }
    this.timer = null;
    this.oldValue = null;
    this.oldHeight = 0;
    this.heightHasBeenAdded = false;
  }

  componentWillMount() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
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
    this.timer = setTimeout(patch, 1000);
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

  renderMessage(comment) {
    // if (this.state.isEditing) {
    //   return (
    //     <TouchableOpacity activeOpacity={1}>
    //       <View style={editBoxStyle}>
    //         <TextInput
    //           style={{ height: Math.min(78, this.state.height), ...editorStyle }}
    //           value={this.state.message}
    //           placeholder='Add a review...'
    //           placeholderTextColor='rgba(0,0,0,0.31)'
    //           multiline
    //           onFocus={this.openEditorBox.bind(this)}
    //           onBlur={() => {
    //             if (this.state.message.length === 0) {
    //               LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    //               this.setState({ editing: false });
    //             }
    //           }}
    //           onContentSizeChange={event => {
    //             const height = event.nativeEvent.contentSize.height;
    //             //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    //             this.setState({
    //               height: Math.min(78, height)
    //             });
    //           }}
    //           onChangeText={message => {
    //             this.setState({ message });
    //           }}
    //           underlineColorAndroid={'transparent'}
    //           autoCapitalize={'sentences'}
    //         />
    //         {this.renderEditSubmit()}
    //       </View>
    //     </TouchableOpacity>
    //   )
    // }
    if (!this.state.expanded) {
      return (
        <Text
          style={messageStyle}
          numberOfLines={4}
          suppressHighlighting
          onPress={() => {
            //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            this.setState({ expanded: true });
          }}
        >
          {comment.message}
        </Text>
      );
    }
    return (
      <Text
        style={messageStyle}
        suppressHighlighting
        onPress={() => {
          //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          this.setState({ expanded: false });
        }}
      >
        {comment.message}
      </Text>
    );
  }

  renderEditButton(render) {
    if (render) {
      return (
        <TouchableOpacity
          onPress={() => console.log('nothing here yet')}
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
            <Text style={headingTextStyle}>Undecided</Text>
            <Icon name='dot-single' size={13} color='rgba(0, 0, 0, 0.3)' style={{ marginHorizontal: 5 }} />
            <Text style={headingTextStyle}>{moment(comment.uploaded_at).fromNow()}</Text>
          </View>

          {this.renderMessage(comment)}

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
