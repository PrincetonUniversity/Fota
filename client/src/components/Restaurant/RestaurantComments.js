import React, { Component } from 'react';
import {
  View, Text, FlatList, TextInput, ScrollView, TouchableOpacity,
  Platform, LayoutAnimation, UIManager
} from 'react-native';
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
      userHasVoted: false
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
    if (newProps.screenProps !== this.props.screenProps) {
      const { userLiked, userDisliked, userHasVoted } = newProps.screenProps;
      this.setState({ userLiked, userDisliked, userHasVoted });
    }
  }

  componentDidUpdate() {
    let newHeight = 40 + this.state.height + this.totalCommentHeight; // 30 padding + 40 for the done
    if (this.state.editing) {
      newHeight += 35;
    }
    if (this.props.screenProps.listHeight !== newHeight && this.hasSentHeight) {
      this.hasSentHeight = false;
    }
    if (!this.hasSentHeight && this.numCommentsAdded === this.state.comments.length && this.props.screenProps.focused === 1) {
      this.hasSentHeight = true;
      this.props.screenProps.setCommentsHeight(newHeight);
    }
  }

  // setListHeight(event) {
  //   //const listHeight = event.nativeEvent.layout.height;
  //   console.log(this.totalCommentHeight);
  //   this.props.screenProps.setCommentHeight(this.totalCommentHeight);
  // }

  openEditorBox() {
    this.props.screenProps.scrollToEdit();
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
    }).then(() => {
      request.get(restCommentRequest(this.props.screenProps.restaurant.id))
      .then(response => {
        this.submitting = false;
        this.setState({
          comments: response.data,
          editing: false,
          submitting: false,
          message: '',
          height: 26
        });
        this.props.screenProps.rerenderComments(response.data);
      }).catch(e => request.showErrorAlert(e));
    }).catch(e => {
      this.submitting = false;
      this.setState({ submitting: false });
      request.showErrorAlert(e);
    });
  }

  findVote(upvote, downvote) {
    if (upvote) return 'liked';
    if (downvote) return 'disliked';
    return null;
  }

  handleYesVote() {
    console.log(this.state);
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
            style={{ height: Math.min(78, this.state.height), ...editorStyle }}
            value={this.state.message}
            placeholder='Add a review...'
            placeholderTextColor='rgba(0,0,0,0.31)'
            multiline
            onFocus={this.openEditorBox.bind(this)}
            onBlur={() => {
              if (this.state.message.length === 0 ) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                this.setState({ editing: false });
              }
            }}
            onContentSizeChange={event => {
              const height = event.nativeEvent.contentSize.height;
              //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              this.setState({
                height: Math.min(78, height)
              });
            }}
            onChangeText={message => {
              this.setState({ message });
            }}
            underlineColorAndroid={'transparent'}
            autoCapitalize={'sentences'}
          />
          {this.renderEditFooter()}
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
    console.log(this.state.userLiked);
    if (this.state.userLiked) {
      yesColor = 'rgba(79, 217, 41, 0.76)';
    }
    if (this.state.userDisliked) {
      noColor = 'rgba(255, 112, 112, 1)';
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (this.state.message.length > 0) {
      return (
        <View style={recommendContainerStyle}>
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
    return (
      <CommentDetail
        comment={comment}
        addHeight={height => { this.totalCommentHeight += height; this.numCommentsAdded += 1; }}
        changeHeight={height => {
          this.totalCommentHeight += height;
          let newHeight = 40 + this.state.height + this.totalCommentHeight;
          if (this.state.editing) {
            newHeight += 30;
          }
          this.props.screenProps.setCommentsHeight(newHeight);
        }}
        vote={this.findVote(comment.user_upvote, comment.user_downvote)}
      />
    );
  }

  render() {
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
          showsVerticalScrollIndicator
          overScrollMode='never'
          bounces={false}
          removeClippedSubviews={false}
        />
      </View>
    );
    // return (
    //   <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
    //     <View style={tabContainerStyle}>

    //       {this.renderComments()}
    //     </View>
    //   </TouchableOpacity>
    // );
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
    fontWeight: '400'
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

export default RestaurantComments;
