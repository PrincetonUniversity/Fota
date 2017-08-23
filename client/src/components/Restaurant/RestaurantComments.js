import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import CommentDetail from './CommentDetail';

class RestaurantComments extends Component {
  static navigationOptions = ({ screenProps }) => ({
    tabBarLabel: `${screenProps.comments.length} COMMENTS`
  });

  state = { comments: [], loading: true }

  componentWillMount() {
    this.setState({ comments: this.props.screenProps.comments, loading: false });
  }

  render() {
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
        renderItem={comment => <CommentDetail comment={comment.item} />}
        showsVerticalScrollIndicator
        overScrollMode='never'
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
