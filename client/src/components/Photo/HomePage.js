/******************************************************************************
 * Called by: Base,
 * Dependencies: lodash, redux, common/Spinner, helpers/axioshelper,
 * Photo/PhotoDetail, Headbar, actions/getPhotosAndRests, actions/loadingTrue
 *
 * Description: The home page. Retrieves and displays a list of nearby photos
 * from the server (radius set by user through settings page), as well as a
 * list of liked/disliked photos by the user from either the server or the
 * device depending on whether or not the user is logged in. Pulling up past
 * the top refreshes the list of photos.
 *
 * Bugs/Todo: Change the order toggler (OrderToggler) to react navigation
 * instead of the current implementation.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { TabNavigator, TabBarTop } from 'react-navigation';
//import request from '../../helpers/axioshelper';
//import { photoRequest } from '../../helpers/URL';
import HotPage from './HotPage';
import NewPage from './NewPage';
//import PhotoList from './PhotoList';
import Headbar from './Headbar';
import { setLoading } from '../../actions/index';
import { tabWidth, tabHeight, horizontalPadding } from '../../Base';
import icoMoonConfig from '../../selection.json';

const Icon = createIconSetFromIcoMoon(icoMoonConfig);

class HomePage extends Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarIcon: ({ focused }) => {
      let color = '#ccc';
      if (focused) color = '#ff9700';
      return (
        <TouchableOpacity
          style={{
            width: tabWidth + horizontalPadding * 2,
            height: tabHeight,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            if (!focused) {
              navigation.navigate('Home');
            }
          }}
        >
          <Icon
            name={'home'}
            color={color}
            size={28}
            style={{
              width: 38,
              textAlign: 'center',
            }}
          />
        </TouchableOpacity>
      );
    }
  });

  state = { photoList: [], loading: true, refreshing: false };

  refreshListView() {
    this.setState({ refreshing: true }, () => this.getPhotoList());
  }

  render() {
    console.log('rendering');
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        {/* <Headbar /> */}
        <HomeNavigator />
      </View>
    );
  }
}

const HomeNavigator = TabNavigator({
  Hot: {
    screen: HotPage
  },
  New: {
    screen: NewPage
  }
},
{
  tabBarPosition: 'top',
  tabBarComponent: TabBarTop,
  swipeEnabled: true,
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: '#ff9700',
    inactiveTintColor: 'rgba(0, 0, 0, 0.23)',
    labelStyle: {
      fontSize: 18,
      fontWeight: '900'
    },
    indicatorStyle: {
      height: 5,
      backgroundColor: '#ff9700',
      //width: 100,
      //marginRight: 10,
      justifyContent: 'center',
      //marginHorizontal: 75,
      //width: (Dimensions.get('window').width - 100) / 2
    },
    style: {
      backgroundColor: 'white',
      //marginHorizontal: 75,
      overflow: 'hidden',
      //flex: 1
      // shadowOffset: { width: 1, height: 5 },
      // shadowOpacity: 0.07,
      // shadowRadius: 3
    }
  }
})

function mapStateToProps({ loading, sorting }) {
  return { loading, sorting };
}

export default connect(mapStateToProps, { setLoading })(HomePage);
