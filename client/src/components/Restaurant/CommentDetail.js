/******************************************************************************
 * Called by: ./RestaurantDetail
 * Dependencies: ./NounDetail, common/CommentDisplay
 *
 * Description: Displays the reviews on the restaurant page. Tapping a review
 * will bring up ./NounDetail, showing the percentage breakdown for the different
 * adjectives used with the noun from the review.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { View, Text } from 'react-native';
//import { Navigator } from 'react-native-deprecated-custom-components';
//import NounDetail from './NounDetail';
//import { CommentDisplay } from '../common';

class CommentDetail extends Component {
  render() {
    return (
      <View style={styles.containerStyle}>
        <Text style={styles.textStyle}>
          {this.props.comment.message}
        </Text>
      </View>
    );
  }
}

const styles = {
    containerStyle: {
      flex: 1,
      flexDirection: 'column',
      height: 50,
      backgroundColor: 'white',
      alignItems: 'center',
      padding: 8,
      // borderTopWidth: 1,
      borderBottomWidth: 1
      // margin: 5
    },
    textStyle: {
      color: 'black',
      fontFamily: 'Avenir',
      fontSize: 12,
      marginLeft: 3,
      marginRight: 3,
    }
};

export default CommentDetail;
