import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import CommentDetail from './CommentDetail';

class RestaurantComments extends Component {
  static navigationOptions = ({ screenProps }) => ({
    tabBarLabel: ({ focused, tintColor }) => {
      const numColor = focused ? '#ff9700' : 'rgba(0, 0, 0, 0.23)';
      let labelText = ' COMMENTS';
      if (screenProps.comments.length === 1) {
        labelText = ' COMMENT';
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
    let listHeight = 490;
    if (this.state.comments.length < 3) {
      listHeight = 275;
    }
    return (
      <FlatList
        style={{ flex: 1, paddingTop: 5 }}
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
  tabLabelStyle: {
    fontSize: 14,
    fontWeight: '900',
    paddingVertical: 5
  },
  emptyTextStyle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#aaa',
  }
};

export default RestaurantComments;
