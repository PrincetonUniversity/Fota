/******************************************************************************
 * Called by: Base
 * Dependencies: redux, ./CameraPage, ./CameraLocationPage, ./CameraCommentsPage,
 * ./CameraLoginForm
 *
 * Description: The main logic for switching between the different camera pages.
 * Currently implemented with a Navigator component.
 *
 * Bugs: CameraLoginForm. May need to take out the modal implementation
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { View } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import CameraPage from './CameraPage';
import CameraLocationPage from './CameraLocationPage';
import LoginPage from '../Account/LoginPage';
import { setCameraState } from '../../actions';

class CameraNavigator extends Component {
  static navigationOptions = {
    tabBarVisible: false,
    tabBarIcon: () => (
      <Icon
        name={'md-add'}
        color='#ccc'
        size={30}
        style={{
          borderColor: '#ccc',
          borderRadius: 5,
          borderWidth: 2,
          width: 38,
          height: 38,
          padding: 4,
          textAlign: 'center',
        }}
      />
    )
  };

  render() {
    if (!this.props.loginState || this.props.loginState.isAnonymous) {
      return <LoginPage onSkip={() => this.props.navigation.dispatch(NavigationActions.back())} />;
    }
    return (
      <View style={{ flex: 1 }}>
        <CameraNav 
          screenProps={{
            goBack: () => this.props.navigation.navigate('Home')
          }} 
        />
      </View>
    );
  }
}

const CameraNav = StackNavigator({
  Camera: {
    screen: CameraPage
  },
  Location: {
    screen: CameraLocationPage
  },
},
{
  headerMode: 'none',
  cardStyle: { backgroundColor: 'white' }
});

function mapStateToProps({ loginState }) {
  return { loginState };
}

export default connect(mapStateToProps, { setCameraState })(CameraNavigator);
