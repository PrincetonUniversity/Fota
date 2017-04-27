import React, { Component } from 'react';
import { View, Image, Text, ScrollView } from 'react-native';
import { Input, CommentDisplay } from './common';

const styles = {
  pageStyle: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF' // #F8F8F8
  },
  headerStyle: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginBottom: 5
  },
  restaurantNameStyle: {
    fontFamily: 'Avenir',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  commentStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  inputStyle: {
    backgroundColor: '#ddd',
    marginHorizontal: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    height: 32
  }
};

const { pageStyle,
        headerStyle,
        restaurantNameStyle,
        commentStyle,
        inputStyle
      } = styles;
const adjectives = ['Great', 'Good', 'OK', 'Bad'];
const nouns = ['Food', 'Ambience', 'Service', 'Atmosphere'];

class CommentUpload extends Component {
  renderRestaurantDetail() {
    this.props.navigator.pop({ id: 0 });
  }

  renderAdjectives() {
    return (adjectives.map(adjective =>
      <CommentDisplay
        key={adjective}
        text={adjective}
      />
    ));
  }

  renderNouns() {
    return (nouns.map(noun =>
      <CommentDisplay
        key={noun}
        text={noun}
      />
    ));
  }

  render() {
    return (
      <View style={pageStyle}>
        <View style={headerStyle}>
          <Text onPress={() => this.renderRestaurantDetail()}>
            Cancel
          </Text>
          <Text>
            What did you think?
          </Text>
        </View>
        <Text style={restaurantNameStyle}>
          {this.props.restaurant.name}
        </Text>
        {/* <Input
          style={inputStyle}
        />
        <Input
          style={inputStyle}
        /> */}
        <View style={commentStyle}>
          <ScrollView bounces={false}>
            {this.renderAdjectives()}
          </ScrollView>
          <ScrollView bounces={false}>
            {this.renderNouns()}
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default CommentUpload;
