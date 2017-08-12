import React, { Component } from 'react';
import { View, Text } from 'react-native';
import CommentDetail from './CommentDetail';

class RestaurantComments extends Component {
  static navigationOptions = {
    tabBarLabel: 'Comments'
  };

  state = { comments: [], loading: true }

  componentWillReceiveProps(nextProps) {
    if (this.props.screenProps.comments !== nextProps.screenProps.comments) {
      this.setState({ comments: nextProps.screenProps.comments, loading: false });
    }
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
    return <CommentDetail nouns={this.state.comments} />;
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
