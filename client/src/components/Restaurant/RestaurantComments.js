import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import CommentDetail from './CommentDetail';
import request from '../../helpers/axioshelper';
import { restCommentRequest } from '../../helpers/URL';

class RestaurantComments extends Component {
  static navigationOptions = {
    tabBarLabel: 'Comments'
  };

  state = { comments: [], loading: true }

  componentWillMount() {
    request.get(restCommentRequest(this.props.screenProps.restaurant.id))
      .then(response => this.setState({ comments: response.data, loading: false }))
      .catch(e => request.showErrorAlert(e));
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.props.screenProps.comments !== nextProps.screenProps.comments) {
  //     this.setState({ comments: nextProps.screenProps.comments, loading: false });
  //   }
  // }

  render() {
    console.log(this.state);
    if (!this.state.loading && this.state.comments.length === 0) {
      return (
        <View style={{ height: 150, justifyContent: 'center' }}>
          <Text style={styles.emptyTextStyle}>
            There are no comments for this restaurant yet. Be the first to write one!
          </Text>
        </View>
      );
    }
    let listHeight = 500;
    if (this.state.comments.length < 3) {
      listHeight = 285;
    }
    return (
      <FlatList
        style={{ height: listHeight, paddingTop: 5 }}
        data={this.state.comments}
        keyExtractor={comment => comment.id}
        showsVerticalScrollIndicator
        renderItem={comment => <CommentDetail comment={comment.item} />}
        bounces={false}
        removeClippedSubviews={false}
      />
    );
  }
}

const styles = {
  emptyTextStyle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#aaa',
    fontFamily: 'Avenir',
  }
};

export default RestaurantComments;
