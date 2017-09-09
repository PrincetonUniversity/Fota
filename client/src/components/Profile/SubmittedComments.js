import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { NotFoundText, Spinner } from '../common';
import RestaurantModal from '../Restaurant/RestaurantModal';
import icoMoonConfig from '../../selection.json';

const Icon = createIconSetFromIcoMoon(icoMoonConfig);

class SubmittedComments extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused }) => {
      let color = 'rgba(0,0,0,0.21)';
      if (focused) {
        color = '#ff7f00';
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
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} ellipsizeMode='middle'>
                <Text style={nameStyle} ellipsizeMode='tail' numberOfLines={1}>
                  {comment.name}
                </Text>
                <Text style={timeStyle}>{`   ${moment(comment.written_at).fromNow()}`}</Text>
              </Text>
              <Text style={messageStyle} ellipsizeMode='tail' numberOfLines={1}>
                {comment.message}
              </Text>
            </View>

            <Text style={voteCountStyle}>{comment.vote_count.toString()}</Text>
            <Ionicon name='ios-arrow-up' color='rgba(0, 0, 0, 0.5)' size={18} />
          </View>
        </View>
      </RestaurantModal>
    );
  }

  render() {
    if (this.props.screenProps.loading) return <Spinner size='large' />;
    if (this.props.screenProps.comments.length === 0) {
      return <NotFoundText text='Write a review to see it here!' />;
    }
    return (
      <View>
        <FlatList
          data={this.props.screenProps.comments}
          keyExtractor={comment => comment.id}
          renderItem={comment => this.renderComment(comment.item)}
          removeClippedSubviews={false}
          getItemLayout={(data, index) => (
            { length: 50, offset: 50 * index, index }
          )}
          onRefresh={this.props.screenProps.refreshPage}
          refreshing={this.props.screenProps.refreshing}
        />
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.09)'
  },
  nameStyle: {
    fontSize: 17,
    fontWeight: '700',
    color: 'rgba(0, 0, 0, 0.66)'
  },
  timeStyle: {
    fontSize: 12,
    fontWeight: '300',
    color: 'rgba(0, 0, 0, 0.5)',
  },
  messageStyle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.8)'
  },
  voteCountStyle: {
    fontSize: 20,
    fontWeight: '300',
    color: 'rgba(0, 0, 0, 0.5)',
    marginHorizontal: 10
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
