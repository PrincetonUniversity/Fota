import React, { Component } from 'react';
import { View, Text, FlatList, TouchableWithoutFeedback, TextInput } from 'react-native';
import CommentDetail from './CommentDetail';

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
          <Text style={[styles.tabLabelStyle, { color: numColor }]}>
            {screenProps.comments.length}
          </Text>
          <Text style={[styles.tabLabelStyle, { color: tintColor }]}>
            {labelText}
          </Text>
        </View>
      );
    },
    indicatorStyle: () => ({
      marginRight: 50
    })
  });

  state = { comments: [], editing: false, message: '' }

  componentWillMount() {
    this.setState({ comments: this.props.screenProps.comments });
  }

  findVote(upvote, downvote) {
    if (upvote) return 'liked';
    if (downvote) return 'disliked';
    return null;
  }

  renderEditBox() {
    if (this.state.editing) {
      return (
        <View>
          <TextInput />
        </View>
      );
    }
    return (
      <TouchableWithoutFeedback onPress={() => this.setState({ editing: true })}>
        <View style={styles.unselectedEditBoxStyle}>
          <Text style={styles.addReviewTextStyle}>Add a review...</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    if (this.state.comments.length === 0) {
      return (
        <View>
          {this.renderEditBox()}
          <View style={{ height: 150, justifyContent: 'center' }}>
            <Text style={styles.emptyTextStyle}>
              There are no comments for this restaurant yet. Be the first to write one!
            </Text>
          </View>
        </View>
      );
    }
    // let listHeight = 490;
    // if (this.state.comments.length < 3) {
    //   listHeight = 275;
    // }
    return (
      <View style={{ flex: 1 }}>
        {this.renderEditBox()}
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
}

const styles = {
  tabLabelStyle: {
    fontSize: 14,
    fontWeight: '900',
    paddingVertical: 5
  },
  emptyTextStyle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#aaa',
  },
  unselectedEditBoxStyle: {
    padding: 20,
    backgroundColor: 'white',
    borderColor: 'rgba(0, 0, 0, 0.06)',
    borderBottomWidth: 1
  },
  addReviewTextStyle: {
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.3)',
    fontWeight: '400'
  }
};

export default RestaurantComments;
