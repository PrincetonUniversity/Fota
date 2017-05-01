import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import axios from 'axios';
import { CommentDisplay, ImageButton, Button } from '../common';

const styles = {
  pageStyle: {
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'center',
    backgroundColor: '#FFFFFF' // #F8F8F8
  },
  headerStyle: {
    flexDirection: 'row',
    marginBottom: 5
  },
  backButtonStyle: { // Back button
    width: 35,
    height: 35,
    // marginRight: 25,
    // marginBottom: 25
  },
  promptStyle: {
    fontFamily: 'Avenir',
    fontSize: 20,
    // fontWeight: 'bold',
    textAlign: 'center'
  },
  restaurantNameStyle: {
    fontFamily: 'Avenir',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  uploadContainerStyle: {
    // flex: -1,
    height: 50, // FIGURE OUT HOW TO NOT HARD CODE THIS
    padding: 1,
    borderRadius: 10,
    backgroundColor: '#808080',
    marginRight: 10,
    marginLeft: 10
  },
  deleteCommentStyle: { // delete a selected comment
    width: 15,
    height: 15,
    // marginRight: 25,
    // marginBottom: 25
  },
  commentTextStyle: {
    color: 'white',
    fontFamily: 'Avenir',
    fontSize: 12,
    marginLeft: 3,
    marginRight: 3,
  },
  commentOptionStyle: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    alignItems: 'center'
  }
};

const { pageStyle,
        headerStyle,
        backButtonStyle,
        promptStyle,
        restaurantNameStyle,
        uploadContainerStyle,
        deleteCommentStyle,
        commentTextStyle,
        commentOptionStyle
      } = styles;

const adjectives = ['Great', 'Good', 'OK', 'Bad'];
const nouns = ['Food', 'Ambience', 'Service', 'Atmosphere'];
const backButton = require('../../img/exit_button.png');

class CommentUpload extends Component {
  state = { adjective: '', noun: '', comments: [] }

  componentDidUpdate() {
    this.addComment();
  }

  setAdjective(adjective) {
    this.setState({ adjective });
  }

  setNoun(noun) {
    this.setState({ noun });
  }

  addComment() {
    const adj = this.state.adjective;
    const noun = this.state.noun;
    const newComment = `${adj} ${noun}`;
    if (adj && noun) {
      if (this.state.comments.indexOf(newComment) === -1) {
        this.setState({
          adjective: '',
          noun: '',
          comments: this.state.comments.concat(`${adj} ${noun}`)
        });
      }
    }
  }

  deleteComment(comment) {
    let comments = this.state.comments;
    const index = comments.indexOf(comment);
    comments.splice(index, 1);
    console.log(comments);
    this.setState({ comments });
  }

  submitComments() {
    if (this.state.comments.length === 0) {
      return;
    }
    this.state.comments.map(comment => this.submitComment(comment));
    this.renderRestaurantDetail();
  }

  submitComment(comment) {
    const words = comment.split(' ');
    const adj = words[0];
    const noun = words[1];
    axios.post('https://fotafood.herokuapp.com/api/comment', {
      noun,
      adj,
      rest: this.props.restaurant.id
    })
      .catch(error => console.log(error));
  }

  renderRestaurantDetail() {
    this.props.navigator.resetTo({ id: 0 });
  }

  renderComments() {
    if (this.state.comments.length !== 0) {
      return (
        <ScrollView
          style={uploadContainerStyle}
          horizontal
          bounces={false}
        >
          {this.renderComment()}
        </ScrollView>
      );
    }
    return (
      <View style={uploadContainerStyle}>
        <Text style={commentTextStyle}>
          Say something about this restaurant...
        </Text>
      </View>
    );
  }

  renderComment() {
    return this.state.comments.map(comment =>
      <CommentDisplay
        key={comment}
        text={comment}
      >
        <ImageButton
          style={deleteCommentStyle}
          source={backButton}
          onPress={() => this.deleteComment(comment)}
        />
      </CommentDisplay>
    );
  }

  renderAdjective(adjective) {
    return (
      <TouchableOpacity
        key={adjective}
        onPress={() => this.setAdjective(adjective)}
      >
        <CommentDisplay text={adjective} />
      </TouchableOpacity>
    );
  }

  renderNoun(noun) {
    return (
      <TouchableOpacity
        key={noun}
        onPress={() => this.setNoun(noun)}
      >
        <CommentDisplay text={noun} />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={pageStyle}>
        <View style={headerStyle}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
            <ImageButton
              style={backButtonStyle}
              source={backButton}
              onPress={() => this.renderRestaurantDetail()}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={promptStyle}>
              What did you think?
            </Text>
          </View>

          <View
            style={{ flex: 1 }}
          />
        </View>

        <Text style={restaurantNameStyle}>
          {this.props.restaurant.name}
        </Text>

        <View>
          {this.renderComments()}
        </View>

        <View style={commentOptionStyle}>
          <View
            style={{ flex: 1 }}
          />

          <FlatList
            data={adjectives}
            keyExtractor={(index) => index.toString()}
            renderItem={adjective => this.renderAdjective(adjective.item)}
            bounces={false}
          />
          <FlatList
            data={nouns}
            keyExtractor={(index) => index.toString()}
            renderItem={noun => this.renderNoun(noun.item)}
            bounces={false}
          />

          <View style={{ flex: 1 }} />
        </View>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }} />
          <Button onPress={() => this.submitComments()}>
              Submit
          </Button>
          <View style={{ flex: 1 }} />
        </View>

      </View>
    );
  }
}

export default CommentUpload;
