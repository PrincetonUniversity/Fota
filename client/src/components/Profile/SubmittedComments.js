import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { NotFoundText } from '../common';
import RestaurantModal from '../Restaurant/RestaurantModal';
import icoMoonConfig from '../../selection.json';

const Icon = createIconSetFromIcoMoon(icoMoonConfig);

class SubmittedComments extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused }) => {
      let color = 'rgba(0,0,0,0.21)';
      if (focused) {
        color = '#ff9700';
      }
      return (
        <Icon
          name={'comments'}
          color={color}
          size={20}
        />
      );
    }
  };

  renderComment(comment) {
    return (
      <RestaurantModal restaurantid={comment.rest_id}>
        <View style={containerStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View>
              <Text>
                <Text style={nameStyle}>{comment.name}</Text>
                <Text style={timeStyle}>{moment(comment.written_at).fromNow()}</Text>
              </Text>
              <Text style={messageStyle} ellipsizeMode='tail' numberOfLines={1}>{comment.message}</Text>
            </View>

            <Text style={voteCountStyle}>{comment.vote_count.toString()}</Text>
            <Ionicon name='ios-arrow-up' color='rgba(0, 0, 0, 0.6)' size={10} />
          </View>
        </View>
      </RestaurantModal>
    );
  }

  render() {
    if (this.props.screenProps.comments.length === 0) {
      return <NotFoundText text='Write a review to see it here!' />;
    }
    return (
      <View>
        <FlatList
          data={this.props.screenProps.comments}
          keyExtractor={comment => comment.id}
          renderItem={comment => this.renderComment(comment.item)}
          bounces={false}
          removeClippedSubviews={false}
          getItemLayout={(data, index) => (
            { length: 50, offset: 50 * index, index }
          )}
        />
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    padding: 20
  },
  nameStyle: {
    fontSize: 17,
    fontWeight: '700',
    color: 'rgba(0, 0, 0, 0.66)'
  },
  timeStyle: {
    fontSize: 12,
    fontWeight: '300',
    color: 'rgba(0, 0, 0, 0.5)'
  },
  messageStyle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.8)'
  },
  voteCountStyle: {
    fontSize: 20,
    fontWeight: '300',
    color: 'rgba(0, 0, 0, 0.5)'
  }
};

const {
  containerStyle,
  nameStyle,
  timeStyle,
  messageStyle,
  voteCountStyle
} = styles;

export default SubmittedComments;
