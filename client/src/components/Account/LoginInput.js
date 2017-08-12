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
  state = { hidePassword: true };

  renderShowHide() {
    console.log(this.props.secure);
    if (this.props.secure) {
      return (
        <Text
          style={styles.showHideStyle}
          onPress={() => this.setState({ hidePassword: !this.state.hidePassword })}
        >
          {this.state.hidePassword ? 'SHOW' : 'HIDE'}
        </Text>
      );
    }
  }

  render() {
    const { label, secure, value, onChangeText } = this.props;
    return (
      <View style={{ marginVertical: 15 }}>
        <Text style={styles.labelStyle}>{label}</Text>
        <View style={styles.containerStyle}>
          <TextInput
            style={styles.textStyle}
            value={value}
            onChangeText={onChangeText}
            autoCorrect={false}
            secureTextEntry={secure ? this.state.hidePassword : false}
            underlineColorAndroid={'transparent'}
          />
          {this.renderShowHide()}
        </View>
      </View>
    );
  }
}

const styles = {
  textStyle: {
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    padding: 0,
    color: '#444',
    fontSize: 18,
    flex: 1,
  },
  showHideStyle: {
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    padding: 0,
    marginLeft: 10,
    color: '#aaa',
    fontSize: 15,
  },
  labelStyle: {
    fontSize: 15,
    color: '#aaa',
    fontFamily: 'Avenir',
    marginBottom: 5
  },
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    borderBottomWidth: 1,
    borderColor: '#bbb'
  }
};

export default LoginInput;
