import React, { Component } from 'react';
import {
  View, Text, FlatList, TextInput, ScrollView, TouchableOpacity,
  Platform, LayoutAnimation, UIManager, Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import CommentDetail from './CommentDetail';
import { Spinner, NotFoundText } from '../common';
import request from '../../helpers/axioshelper';
import { restCommentRequest } from '../../helpers/URL';

class RestaurantComments extends Component {
  static navigationOptions = {
    tabBarVisible: false
  }

  // static navigationOptions = ({ screenProps }) => ({
  //   tabBarLabel: ({ focused, tintColor }) => {
  //     const numColor = focused ? '#ff9700' : 'rgba(0, 0, 0, 0.25)';
  //     let labelText = ' REVIEWS';
  //     if (screenProps.comments.length === 1) {
  //       labelText = ' REVIEW';
  //     }
  //     return (
  //       <View style={{ flexDirection: 'row' }}>
  //         <Text style={[tabLabelStyle, { color: numColor }]}>
  //           {screenProps.comments.length}
  //         </Text>
  //         <Text style={[tabLabelStyle, { color: tintColor }]}>
  //           {labelText}
  //         </Text>
  //       </View>
  //     );
  //   },
  //   indicatorStyle: () => ({
  //     marginRight: 50
  //   })
  // });

  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      editing: false,
      submitting: false,
      message: '',
      height: 26,
      userLiked: false,
      userDisliked: false,
      userHasVoted: false,
    };
    this.totalCommentHeight = 0;
    this.numCommentsAdded = 0;
    this.hasSentHeight = false;
    this.submitting = false;
  }

  componentWillMount() {
    this.setState({ comments: this.props.screenProps.comments });
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  componentWillReceiveProps(newProps) {
    console.log(newProps);
    if (newProps.screenProps !== this.props.screenProps) {
      console.log('changing props');
      const { userLiked, userDisliked, userHasVoted } = newProps.screenProps;
      this.setState({ userLiked, userDisliked, userHasVoted });
    }
    // if (newProps.screenProps.focused !== this.props.screenProps.focused) {
    //   this.setState({ focused: newProps.screenProps.focused });
    // }
  }

  updateHeight() {
    console.log('');
    console.log('DID UPDATE');
    let newHeight = 40 + this.state.height + this.totalCommentHeight; // 40 for the done
    if (this.state.editing) {
      newHeight += 35;
    }
    if (this.props.screenProps.listHeight !== newHeight && this.hasSentHeight) {
      this.hasSentHeight = false;
    }
    console.log(`Should be false: ${this.hasSentHeight}`);
    console.log(`${this.numCommentsAdded} === ${this.state.comments.length}`);
    if (!this.hasSentHeight && this.numCommentsAdded === this.state.comments.length) {
      this.hasSentHeight = true;
      this.props.screenProps.setCommentsHeight(newHeight);
      if (this.props.screenProps.focused) {
        this.props.screenProps.renderCommentHeight(newHeight);
      }
    }
  }

  // setListHeight(event) {
  //   //const listHeight = event.nativeEvent.layout.height;
  //   console.log(this.totalCommentHeight);
  //   this.props.screenProps.setCommentHeight(this.totalCommentHeight);
  // }

  openEditorBox() {
    this.props.screenProps.scrollToEdit();
    this.props.screenProps.allowKeyboardToClose();
    if (!this.state.editing) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({ editing: true });
    }
  }

  submitComment() {
    if (this.submitting) return;
    this.submitting = true;
    this.setState({ submitting: true });
    request.post(restCommentRequest(this.props.screenProps.restaurant.id), {
      message: this.state.message
    }).then(comment => {
      Keyboard.dismiss();
      const newComment = {
        id: comment.data.id,
        message: this.state.message,
        author: this.props.loginState.displayName,
        vote_count: 0,
        rest_id: this.props.screenProps.restaurant.id,
        user_upvote: false,
        user_downvote: false,
        my_comment: true,
        uploaded_at: comment.data.now
      };
      const commentList = [newComment, ...this.state.comments];
      this.submitting = false;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({
        comments: commentList,
        editing: false,
        submitting: false,
        message: '',
        height: 26
      });
      this.props.screenProps.rerenderComments(commentList);
    }).catch(e => {
      this.submitting = false;
      this.setState({ submitting: false });
      request.showErrorAlert(e);
    });
  }

  removeComment(id, height) {
    console.log(height);
    const commentList = this.state.comments.filter(comment => comment.id !== id);
    //this.totalCommentHeight -= height;
    //this.numCommentsAdded -= 1;
    console.log(commentList);
    this.setState({ comments: commentList }, () => this.updateHeight());
    this.props.screenProps.rerenderComments(commentList);
  }

  findVote(upvote, downvote) {
    if (upvote) return 'liked';
    if (downvote) return 'disliked';
    return null;
  }

  handleYesVote() {
    if (!this.state.userHasVoted) {
      this.props.screenProps.voteYes();
      this.setState({ userLiked: true, userDisliked: false, userHasVoted: true });
    } else {
      if (this.state.userLiked) {
        this.props.screenProps.clearYes();
        this.setState({ userLiked: false, userDisliked: false, userHasVoted: false });
      } else {
        this.props.screenProps.clearNoVoteYes();
        this.setState({ userLiked: true, userDisliked: false, userHasVoted: true });
      }
    }
  }

  handleNoVote() {
    if (!this.state.userHasVoted) {
      this.props.screenProps.voteNo();
      this.setState({ userLiked: false, userDisliked: true, userHasVoted: true });
    } else {
      if (this.state.userDisliked) {
        this.props.screenProps.clearNo();
        this.setState({ userLiked: false, userDisliked: false, userHasVoted: false });
      } else {
        this.props.screenProps.clearYesVoteNo();
        this.setState({ userLiked: false, userDisliked: true, userHasVoted: true });
      }
    }
  }

  renderEditBox() {
    let paddingBottom = 20;
    if (this.state.editing) {
      paddingBottom = 15;
    }
    return (
      <TouchableOpacity activeOpacity={1}>
        <View style={[editBoxStyle, { paddingBottom }]}>
          <TextInput
            style={{ height: this.state.height, ...editorStyle }}
            value={this.state.message}
            placeholder='Add a review...'
            placeholderTextColor='rgba(0,0,0,0.31)'
            multiline
            onFocus={this.openEditorBox.bind(this)}
            onBlur={() => {
              if (this.state.message.length === 0) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                this.setState({ editing: false });
              }
            }}
            onChange={event => this.setState({
              message: event.nativeEvent.text,
              height: Math.min(78, event.nativeEvent.contentSize.height)
            })}
            underlineColorAndroid={'transparent'}
            autoCapitalize={'sentences'}
          />
          <ScrollView keyboardShouldPersistTaps='handled' scrollEventThrottle={1}>
            {this.renderEditFooter()}
          </ScrollView>
        </View>
      </TouchableOpacity>
    );
  }

  renderEditFooter() {
    if (this.state.editing) {
      return (
        <View style={editFooterContainerStyle}>
          {this.renderRecommend()}
          {this.renderDoneButton()}
        </View>
      );
    }
  }

  renderRecommend() {
    let yesColor = 'rgba(0, 0, 0, 0.31)';
    let noColor = 'rgba(0, 0, 0, 0.31)';
    if (this.state.userLiked) {
      yesColor = 'rgba(79, 217, 41, 0.76)';
    }
    if (this.state.userDisliked) {
      noColor = 'rgba(255, 112, 112, 1)';
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (this.state.message.length > 0) {
      return (
        <View style={recommendContainerStyle} onStartShouldSetPanResponder={() => true}>
          <Text style={recommendPromptStyle}>Recommend this restaurant?</Text>
          <TouchableOpacity onPress={this.handleYesVote.bind(this)}>
            <View style={[voteBoxStyle, { marginLeft: 5 }]}>
              <Text style={[recommendVoteStyle, { color: yesColor }]}>YES</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleNoVote.bind(this)}>
            <View style={voteBoxStyle}>
              <Text style={[recommendVoteStyle, { color: noColor }]}>NO</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    return <View />;
  }

  renderDoneButton() {
    if (this.state.submitting) {
      return <View style={doneButtonStyle}><Spinner size="small" /></View>;
    }
    let color = 'rgba(0, 0, 0, 0.3)';
    let action = () => this.setState({ editing: false });
    if (this.state.message.length > 0) {
      color = '#2494ff';
      action = () => this.submitComment();
    }
    return (
      <TouchableOpacity onPress={action}>
        <View style={doneButtonStyle}>
          <Text style={{ color, fontSize: 15, fontWeight: '900' }}>DONE</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderComment(comment) {
    //console.log(`${comment.message}`);
    return (
      <CommentDetail
        key={comment.id}
        comment={comment}
        subtractHeight={height => {
          this.totalCommentHeight -= height;
          this.numCommentsAdded -= 1;
        }}
        addHeight={height => {
          this.totalCommentHeight += height;
          this.numCommentsAdded += 1;
          this.updateHeight();
        }}
        changeHeight={height => {
          this.totalCommentHeight += height;
          let newHeight = 40 + this.state.height + this.totalCommentHeight;
          if (this.state.editing) {
            newHeight += 30;
          }
          this.props.screenProps.setCommentsHeight(newHeight);
        }}
        deleteComment={this.removeComment.bind(this)}
        vote={this.findVote(comment.user_upvote, comment.user_downvote)}
      />
    );
  }

  render() {
    console.log('');
    console.log('RENDERING');
    console.log(this.state);
    if (this.state.comments.length === 0) {
      return (
        <View style={{ flex: 1 }}>
          {this.renderEditBox()}
          <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
            <NotFoundText height={150} text='There are no comments for this restaurant yet. Be the first to write one!' />
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        {this.renderEditBox()}
        <FlatList
          data={this.state.comments}
          keyExtractor={comment => comment.id}
          renderItem={c => this.renderComment(c.item)}
          scrollEnabled={false}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator
          overScrollMode='never'
          bounces={false}
          removeClippedSubviews={false}
        />
      </View>
    );
  }
}

const styles = {
  editBoxStyle: {
    paddingHorizontal: 20,
    paddingTop: 20,
    //paddingBottom: 10,
    // padding: 20,
    backgroundColor: 'white',
    borderColor: 'rgba(0, 0, 0, 0.06)',
    borderBottomWidth: 1,
  },
  editorStyle: {
    padding: 0,
    color: 'rgba(0,0,0,0.75)',
    fontSize: 15,
    lineHeight: Platform.OS === 'android' ? 20 : 26,
    fontWeight: '400',
  },
  editFooterContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  },
  recommendContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: 20
  },
  voteBoxStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    paddingHorizontal: 7
  },
  recommendPromptStyle: {
    fontSize: 14,
    //flex: 1,
    //textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.31)',
    //marginLeft: 15
  },
  recommendVoteStyle: {
    fontSize: 12,
    fontWeight: '900'
  },
  doneButtonStyle: {
    width: 50,
    height: 20
  },
};

const {
  editBoxStyle,
  editorStyle,
  editFooterContainerStyle,
  recommendContainerStyle,
  voteBoxStyle,
  recommendPromptStyle,
  recommendVoteStyle,
  doneButtonStyle,
} = styles;

function mapStateToProps({ loginState }) {
  return { loginState };
}

export default connect(mapStateToProps)(RestaurantComments);
