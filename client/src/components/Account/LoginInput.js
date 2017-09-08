/******************************************************************************
 * Called by: Account/LoginForm, Camera/CameraCommentsPage,
 * Camera/CameraLocationPage, ./CommentDisplayInput, Restaurant/CommentUpload,
 * Restaurant/RestaurantDetail, Search/SearchPage
 * Dependencies:
 *
 * Description: Visual component for entering text.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { Text, View, TextInput } from 'react-native';

class LoginInput extends Component {
  focus() {
    this.textInput.focus();
  }

  render() {
    const {
      label,
      secure,
      value,
      onChangeText,
      onBlur,
      onFocus,
      blurOnSubmit,
      keyboardType,
      autoCapitalize,
      onSubmitEditing,
      returnKeyType
    } = this.props;
    return (
      <View style={styles.containerStyle}>
        <TextInput
          ref={textInput => { this.textInput = textInput; }}
          style={styles.textStyle}
          value={value}
          placeholder={label}
          placeholderTextColor='rgba(0, 0, 0, 0.15)'
          onChangeText={onChangeText}
          onBlur={onBlur}
          onFocus={onFocus}
          blurOnSubmit={blurOnSubmit}
          autoCapitalize={autoCapitalize || 'none'}
          autoCorrect={false}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType || 'default'}
          secureTextEntry={secure}
          underlineColorAndroid={'transparent'}
          keyboardType={keyboardType || 'default'}
        />
      </View>
    );
  }
}

const styles = {
  textStyle: {
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 15,
    color: 'rgba(0, 0, 0, 0.55)',
    fontSize: 15,
    flex: 1,
  },
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 37,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 7,
    marginVertical: 8
  }
};

export default LoginInput;
