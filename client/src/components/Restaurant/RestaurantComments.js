import React, { Component } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import CommentDetail from './CommentDetail';
import { Spinner } from '../common';
import request from '../../helpers/axioshelper';
import { restCommentRequest } from '../../helpers/URL';

class RestaurantComments extends Component {
  static navigationOptions = ({ screenProps }) => ({
    tabBarLabel: ({ focused, tintColor }) => {
      const numColor = focused ? '#ff9700' : 'rgba(0, 0, 0, 0.25)';
      let labelText = ' REVIEWS';
      if (screenProps.comments.length === 1) {
        labelText = ' REVIEW';
      }
      return (
        <View style={{ flexDirection: 'row' }}>
          <Text style={[tabLabelStyle, { color: numColor }]}>
            {screenProps.comments.length}
          </Text>
          <Text style={[tabLabelStyle, { color: tintColor }]}>
            {labelText}
          </Text>
        </View>
      );
    },
    indicatorStyle: () => ({
      marginRight: 50
    })
  });

  constructor(props) {
    super(props);
    this.state = { comments: [], editing: false, submitting: false, message: '', height: 20 };
    this.submitting = false;
  }

  componentWillMount() {
    this.setState({ comments: this.props.screenProps.comments });
  }

  findVote(upvote, downvote) {
    if (upvote) return 'liked';
    if (downvote) return 'disliked';
    return null;
  }

  openEditorBox() {
    this.props.screenProps.scrollToEnd();
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
          height: 20
        });
        this.props.screenProps.rerenderComments(response.data);
      }).catch(e => request.showErrorAlert(e));
    }).catch(e => {
      this.submitting = false;
      this.setState({ submitting: false });
      request.showErrorAlert(e);
    });
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View />
          {this.renderDoneButton()}
        </View>
      );
    }
  }

  renderComments() {
    if (this.state.comments.length === 0) {
      return (
        <View>
          <View style={{ height: 150, justifyContent: 'center' }}>
            <Text style={emptyTextStyle}>
              There are no comments for this restaurant yet. Be the first to write one!
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.comments}
          keyExtractor={comment => comment.id}
          renderItem={c => {
            const comment = c.item;
            return (
              <CommentDetail
                comment={comment}
                vote={this.findVote(comment.user_upvote, comment.user_downvote)}
              />
            );
          }}
          showsVerticalScrollIndicator
          overScrollMode='never'
          bounces={false}
          removeClippedSubviews={false}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={tabContainerStyle}>
        <View style={editBoxStyle}>
          <TextInput
            style={{ height: Math.min(60, this.state.height), ...editorStyle }}
            value={this.state.message}
            placeholder='Add a review...'
            multiline
            onFocus={this.openEditorBox.bind(this)}
            onChange={event => this.setState({
              message: event.nativeEvent.text,
              height: event.nativeEvent.contentSize.height
            })}
            underlineColorAndroid={'transparent'}
            autoCapitalize={'sentences'}
          />
          {this.renderEditSubmit()}
        </View>
        {this.renderComments()}
      </View>
    );
  }
}

const styles = {
  tabLabelStyle: {
    fontSize: 14,
    fontWeight: '900',
    paddingVertical: 5
  },
  tabContainerStyle: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    shadowRadius: 2,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 }
  },
  emptyTextStyle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#aaa',
  },
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
    fontWeight: '400'
  },
  doneButtonStyle: {
    width: 50,
    marginTop: 10
  }
};

const {
  tabLabelStyle,
  tabContainerStyle,
  emptyTextStyle,
  editBoxStyle,
  editorStyle,
  doneButtonStyle,
} = styles;

export default RestaurantComments;
