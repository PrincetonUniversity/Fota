import React, { Component } from 'react';
import { View, Text } from 'react-native';
import request from '../../helpers/axioshelper';
import CommentDetail from './CommentDetail';

const commentDetails = 'https://fotafood.herokuapp.com/api/comment/';

class RestaurantComments extends Component {
  static navigationOptions = {
    tabBarLabel: 'Comments'
  };

  state = { nouns: [], loading: true }

  componentWillMount() {
    request.get(commentDetails + this.props.screenProps.restaurant.id)
    .then(response => this.setState({
      nouns: response.data,
      loading: false
    })).catch(e => request.showErrorAlert(e));
  }

  render() {
    if (!this.state.loading && this.state.nouns.length === 0) {
      return (
        <View style={{ flex: 1, marginHorizontal: 20, marginTop: 5 }}>
          <Text style={styles.emptyTextStyle}>
            There are no comments for this restaurant yet. Be the first to write one!
          </Text>
        </View>
      );
    }
    return <CommentDetail nouns={this.state.nouns} />;
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
