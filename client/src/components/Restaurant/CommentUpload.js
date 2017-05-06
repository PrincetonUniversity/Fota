import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import request from '../../helpers/axioshelper';
import { CommentDisplay, CommentDisplayInput, ImageButton, Button } from '../common';

const styles = {
  pageStyle: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF' // #F8F8F8
  },
  headerStyle: {
    flexDirection: 'row',
    marginBottom: 5
  },
  backButtonStyle: { // Back button
    width: 35,
    height: 35,
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
    textAlign: 'center',
    marginBottom: 10
  },
  uploadContainerStyle: {
    height: 50, // FIGURE OUT HOW TO NOT HARD CODE THIS
    padding: 1,
    borderRadius: 10,
    backgroundColor: '#b2b2b2',
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 10
  },
  commentTextInputStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 4
  },
  commentTextStyle: {
    color: 'white',
    fontFamily: 'Avenir',
    fontSize: 15,
    marginLeft: 7,
    opacity: 0.8
  },
  deleteCommentStyle: { // delete a selected comment
    width: 15,
    height: 15,
  },
  commentOptionStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  }
};

const { pageStyle,
        headerStyle,
        backButtonStyle,
        promptStyle,
        restaurantNameStyle,
        uploadContainerStyle,
        deleteCommentStyle,
        commentTextInputStyle,
        commentTextStyle,
        commentOptionStyle
      } = styles;

const adjectives = ['Great', 'Good', 'OK', 'Bad'];
const nouns = ['Food', 'Ambience', 'Service', 'Atmosphere'];
const backButton = require('../../img/exit_button.png');

class CommentUpload extends Component {
  state = { adjective: '', noun: '', comments: [], newAdjective: '', newNoun: '' }

// Usually called after clicking a bubble
  componentDidUpdate() {
    this.addComment();
  }

// Set the selected adjective
  setAdjective(adjective) {
    console.log(adjective);
    if (/^[a-z]+$/i.test(adjective)) {
      let cleanAdj = adjective.toLowerCase();
      cleanAdj = cleanAdj.charAt(0).toUpperCase() + cleanAdj.slice(1);
      this.setState({ adjective: cleanAdj });
    }
  }

// Set the selected noun
  setNoun(noun) {
    if (/^[a-z]+$/i.test(noun)) {
      let cleanNoun = noun.toLowerCase();
      cleanNoun = cleanNoun.charAt(0).toUpperCase() + cleanNoun.slice(1);
      this.setState({ noun: cleanNoun });
    }
  }

  updateNewAdjective(newAdjective) {
    this.setState({ newAdjective });
  }

  updateNewNoun(newNoun) {
    this.setState({ newNoun });
  }

// If possible, add a comment. If it already exists, clear fields
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
      } else {
        this.setState({ adjective: '', noun: '' });
      }
    }
  }

// Delete a adjective/noun/comment from selections
  deleteComment(comment, type) {
    if (type === 0) {
      this.setState({ adjective: '' });
    } else if (type === 1) {
      this.setState({ noun: '' });
    } else if (type === 2) {
      const comments = this.state.comments;
      const index = comments.indexOf(comment);
      comments.splice(index, 1);
      this.setState({ comments });
    }
    return;
  }

// Submit all comments
  submitComments() {
    if (this.state.comments.length === 0) {
      return;
    }
    this.state.comments.map(comment => this.submitComment(comment));
    this.renderRestaurantDetail();
  }

// Helper function to submit a single comment
  submitComment(comment) {
    const words = comment.split(' ');
    const adj = words[0];
    const noun = words[1];
    request.post('https://fotafood.herokuapp.com/api/comment', {
      noun,
      adj,
      rest: this.props.restaurant.id
    })
      .catch(e => request.showErrorAlert(e));
  }

// For pressing the back button
  renderRestaurantDetail() {
    this.props.navigator.resetTo({ id: 0 });
  }

// Render the bar containing all selected comments
  renderCommentsInput() {
    if (this.state.comments.length !== 0 || this.state.adjective !== '' || this.state.noun !== '') {
      return (
        <ScrollView
          style={uploadContainerStyle}
          horizontal
          bounces={false}
        >
          {this.renderAllComments()}
          {this.renderSingleComment(this.state.adjective, 0)}
          {this.renderSingleComment(this.state.noun, 1)}
        </ScrollView>
      );
    }
    return (
      <View style={{ ...uploadContainerStyle, ...{ justifyContent: 'center' } }}>
        <Text style={commentTextStyle}>
          Say something about this restaurant...
        </Text>
      </View>
    );
  }

// Visuall rendering all comments
  renderAllComments() {
    return this.state.comments.map(comment =>
      this.renderSingleComment(comment, 2)
    );
  }

// Rendering a single comment with type.
// type === 0: adjective, type === 1: noun, type === 2: comment
  renderSingleComment(comment, type) {
    if (comment) {
      return (
        <CommentDisplay
          key={comment}
          text={comment}
        >
          <ImageButton
            style={deleteCommentStyle}
            source={backButton}
            onPress={() => this.deleteComment(comment, type)}
          />
        </CommentDisplay>
      );
    }
    return;
  }

// Set current adjective to adjective
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

// Set current noun to noun
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

          <View style={{ flex: 1 }} />
        </View>

        <Text style={restaurantNameStyle}>
          {this.props.restaurant.name}
        </Text>

        <View>
          {this.renderCommentsInput()}
        </View>

        <View style={commentTextInputStyle}>
          <View style={{ flex: 1 }} />

          <View style={{ flex: 2, height: 34 }}>
            <CommentDisplayInput
              value={this.state.newAdjective}
              placeholder='Adjective'
              onChangeText={adjective => this.updateNewAdjective(adjective)}
              onBlur={() => {
                this.setAdjective(this.state.newAdjective);
                this.setState({ newAdjective: '' });
              }}
            />
          </View>

          <View style={{ flex: 2 }}>
            <CommentDisplayInput
              value={this.state.newNoun}
              placeholder='Noun'
              onChangeText={noun => this.updateNewNoun(noun)}
              onBlur={() => {
                this.setNoun(this.state.newNoun);
                this.setState({ newNoun: '' });
              }}
            />
          </View>

          <View style={{ flex: 1 }} />
        </View>

        <View style={commentOptionStyle}>
          <View style={{ flex: 1 }} />

          <View style={{ flex: 2 }}>
            <FlatList
              data={adjectives}
              keyExtractor={(index) => index.toString()}
              renderItem={adjective => this.renderAdjective(adjective.item)}
              keyboardShouldPersistTaps={'handled'}
            />
          </View>

          <View style={{ flex: 2 }}>
            <FlatList
              data={nouns}
              keyExtractor={(index) => index.toString()}
              renderItem={noun => this.renderNoun(noun.item)}
              keyboardShouldPersistTaps={'handled'}
            />
          </View>

          <View style={{ flex: 1 }} />
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Button onPress={() => this.submitComments()}>
              Submit
          </Button>
        </View>
      </View>
    );
  }
}

export default CommentUpload;
