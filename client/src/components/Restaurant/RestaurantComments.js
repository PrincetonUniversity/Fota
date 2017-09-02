import React, { Component } from 'react';
import { View, Text, FlatList, TextInput, ScrollView, TouchableOpacity } from 'react-native';
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
    this.state = { comments: [], editing: false, submitting: false, message: '', height: 26 };
    this.totalCommentHeight = 0;
    this.numCommentsAdded = 0;
    this.hasSentHeight = false;
    this.submitting = false;
  }

  componentWillMount() {
    this.setState({ comments: this.props.screenProps.comments });
  }

  componentDidUpdate() {
    if (!this.hasSentHeight && this.numCommentsAdded === this.state.comments.length && this.props.screenProps.focused === 1) {
      this.hasSentHeight = true;
      //console.log(this.totalCommentHeight);
      this.props.screenProps.setCommentsHeight(40 + Math.min(78, this.state.height) + this.totalCommentHeight);
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

  renderEditSubmit() {
    if (this.state.editing) {
      return (
        <ScrollView
          scrollEnabled={false}
          bounces={false}
          keyboardShouldPersistTaps='always'
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View />
            {this.renderDoneButton()}
          </View>
        </ScrollView>
      );
    }
  }

  renderEditBox() {
    return (
      <TouchableOpacity activeOpacity={1}>
        <View style={editBoxStyle}>
          <TextInput
            style={{ height: Math.min(78, this.state.height), ...editorStyle }}
            value={this.state.message}
            placeholder='Add a review...'
            placeholderTextColor='rgba(0,0,0,0.31)'
            multiline
            onFocus={this.openEditorBox.bind(this)}
            onChange={event => {
              const height = event.nativeEvent.contentSize.height;
              console.log(height);
              this.setState({
                message: event.nativeEvent.text,
                height: Math.min(78, height)
              });
            }}
            underlineColorAndroid={'transparent'}
            autoCapitalize={'sentences'}
          />
          {this.renderEditSubmit()}
        </View>
      </TouchableOpacity>
    );
  }

  renderComment(comment) {
    return (
      <CommentDetail
        comment={comment}
        addHeight={height => { this.totalCommentHeight += height; this.numCommentsAdded += 1; }}
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
    padding: 20,
    backgroundColor: 'white',
    borderColor: 'rgba(0, 0, 0, 0.06)',
    borderBottomWidth: 1,
  },
  editorStyle: {
    padding: 0,
    color: 'rgba(0,0,0,0.75)',
    fontSize: 15,
    lineHeight: 26,
    fontWeight: '400'
  },
  doneButtonStyle: {
    width: 50,
    marginTop: 10
  }
};

const {
  editBoxStyle,
  editorStyle,
  doneButtonStyle,
} = styles;

export default RestaurantComments;
