/******************************************************************************
 * Called by: Base
 * Dependencies: redux, common/ImageButton, Account/LoginForm,
 * actions/setCameraState
 *
 * Description: Called when the user tries to take a picture without being
 * logged in. Prompts the user with a login form (Account/LoginForm).
 *
 * Bugs: Need to fix what happens when login form is closed
 *
 ******************************************************************************/

import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { ImageButton } from '../common';
import LoginForm from '../Account/LoginForm';
import { setCameraState } from '../../actions';

const CameraLoginForm = (props) => (
  <View style={styles.fadeStyle}>
    <View style={styles.pageStyle}>
      <Text style={styles.textStyle}>Please log in to upload photos.</Text>
      <LoginForm onLoginFinished={() => console.log('login finished')} />
      {/* <LoginForm onLoginFinished={() => openCamera(props.navigator)} /> */}
      <ImageButton
        style={styles.backArrowStyle}
        source={require('../../img/exit_button.png')}
        onPress={() => props.navigation.goBack('Camera')}
      />
    </View>
  </View>
);

//props.setCameraState(false)

const styles = {
  backArrowStyle: {
    left: 5,
    top: 5,
    height: 30,
    width: 30,
    position: 'absolute'
  },
  textStyle: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 10
  },
  fadeStyle: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  pageStyle: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 20,
    padding: 5,
    paddingBottom: 15
  }
};

export default connect(null, { setCameraState })(CameraLoginForm);
