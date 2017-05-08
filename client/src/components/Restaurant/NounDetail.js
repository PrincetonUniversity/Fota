import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import { CommentDisplay, ImageButton } from '../common';

class NounDetail extends Component {

  renderComment(adj, count) {
    const percent = Math.round((count * 100.0) / this.props.noun.totalCount);
    const commentString = `${adj} ${this.props.noun.noun}: ${percent}%`;
    return (
      <CommentDisplay text={commentString} />
    );
  }

  render() {
    return (
      <View>
        <ImageButton
          style={{ position: 'absolute', height: 30, width: 30 }}
          source={require('../../img/back_arrow.png')}
          onPress={() => this.props.navigator.pop()}
        />
        <FlatList
          style={{ alignSelf: 'center' }}
          data={this.props.noun.adj}
          keyExtractor={adj => adj.word}
          showsVerticalScrollIndicator={false}
          renderItem={adj => this.renderComment(adj.item.word, adj.item.count)}
          removeClippedSubviews={false}
          bounces={false}
        />
      </View>
    );
  }
}

export default NounDetail;
