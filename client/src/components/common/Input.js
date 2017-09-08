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
import { View, TextInput, TouchableOpacity } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

class Input extends Component {
  renderDeleteButton() {
    if (this.props.showDeleteAll) {
      return (
        <TouchableOpacity onPress={this.props.delete}>
          <Ionicon
            name='ios-close-circle'
            borderRadius={0}
            color='gray'
            backgroundColor='white'
            size={19}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      );
    }
    return <View />;
  }

  render() {
    const {
      style,
      children,
      placeholder,
      autoFocus,
      onFocus,
      placeholderAlign,
      secure,
      value,
      onChangeText
    } = this.props;
    return (
      <View style={{ ...style, ...styles.containerStyle }}>
        {children}
        <TextInput
          style={styles.inputStyle}
          value={value}
          placeholder={placeholder}
          placeholderTextColor='rgba(0, 0, 0, 0.2)'
          textAlign={placeholderAlign}
          onChangeText={onChangeText}
          autoFocus={autoFocus}
          onFocus={onFocus}
          autoCorrect
          secureTextEntry={secure}
          underlineColorAndroid={'transparent'}
        />
        <View style={{ alignItems: 'flex-end' }}>
          {this.renderDeleteButton()}
        </View>
      </View>
    );
  }
}

const styles = {
  inputStyle: {
    padding: 1,
    borderRadius: 3,
    color: 'rgba(0,0,0,0.4)',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 14,
    fontWeight: '300',
    flex: 1
  },
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
};

export { Input };
