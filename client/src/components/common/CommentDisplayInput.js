/******************************************************************************
 * Called by: Camera/CameraCommentsPage, Restaurant/CommentUpload
 * Dependencies:
 *
 * Description: Visual component for displaying indidual custom comments (user
 * types in their own word).
 *
 ******************************************************************************/

import React from 'react';
import { TextInput, View } from 'react-native';

const CommentDisplayInput = ({ placeholder, value, onChangeText, secure, onBlur }) => (
  <View style={styles.containerStyle}>
    <TextInput
      style={styles.inputStyle}
      value={value}
      defaultValue={placeholder}
      placeholder={placeholder}
      placeholderTextColor='white'
      onChangeText={onChangeText}
      autoCorrect
      secureTextEntry={secure}
      underlineColorAndroid={'transparent'}
      onBlur={onBlur}
    />
  </View>
);

const styles = {
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b2b2b2',
    paddingHorizontal: 12,
    borderRadius: 16,
    height: 32,
    marginLeft: 5,
    marginRight: 5
  },
  inputStyle: {
    padding: 1,
    borderRadius: 3,
    color: 'white',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 12,
    fontFamily: 'Avenir',
    flex: 1,
    textAlign: 'center'
  },
};

export { CommentDisplayInput };
