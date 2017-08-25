/******************************************************************************
 * Called by: Camera/CameraCommentsPage, Restaurant/CommentDetail,
 * Restaurant/CommentUpload, Restaurant/NounDetail
 * Dependencies:
 *
 * Description: Visual component for displaying indidual comments (pre-selected).
 *
 ******************************************************************************/

import React from 'react';
import { Text, View } from 'react-native';

const CommentDisplay = (props) => (
  <View style={styles.containerStyle}>
    <Text style={styles.textStyle}>
      {props.text}
    </Text>
    {props.children}
  </View>
);

const styles = {
    containerStyle: {
      flex: 1,
      flexDirection: 'row',
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
      fontSize: 12,
      marginLeft: 3,
      marginRight: 3,
    }
};

export { CommentDisplay };
