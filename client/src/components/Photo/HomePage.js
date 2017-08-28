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
import { Text, View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { connect } from 'react-redux';
//import Spinner from 'react-native-loading-spinner-overlay';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { TabNavigator, TabBarTop } from 'react-navigation';
//import request from '../../helpers/axioshelper';
//import { photoRequest } from '../../helpers/URL';
import HotPage from './HotPage';
import NewPage from './NewPage';
//import PhotoList from './PhotoList';
import Headbar from './Headbar';
import { Input } from '../common';
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
      <View style={pageStyle}>
        <View style={searchContainerStyle}>
          <Icon.Button
            name='search'
            color='rgba(0,0,0,0.34)'
            backgroundColor='transparent'
            size={19}
            style={{ flex: 1 }}
          >
            <Text style={searchTextStyle}>Search</Text>
          </Icon.Button>
        </View>
        {/* <View style={{ flexDirection: 'row' }}>
          <Input
            style={{
              backgroundColor: 'rgba(0,0,0,0.06)',
              //paddingHorizontal: 12,
              height: 32,
              borderRadius: 7,
              marginHorizontal: 20,
              marginTop: 11,
              marginBottom: 1
              //marginVertical: 5
            }}
            placeholder='Search'
            placeholderAlign='center'
            //value={this.state.query}
            //onChangeText={query => this.updateQuery(query)}
          />
        </View> */}
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
      fontSize: 16,
      margin: 0,
      fontWeight: '900'
    },
    indicatorStyle: {
      height: 4,
      backgroundColor: '#ff9700',
      //width: 100,
      //marginRight: 10,
      justifyContent: 'center',
      //marginHorizontal: 75,
      //width: (Dimensions.get('window').width - 100) / 2
    },
    tabStyle: {
      width: 120,
      padding: 5
    },
    style: {
      backgroundColor: 'white',
      //alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: Dimensions.get('window').width / 2 - 120,
      overflow: 'hidden'
      //flex: 1
      // shadowOffset: { width: 1, height: 5 },
      // shadowOpacity: 0.07,
      // shadowRadius: 3
    }
  }
});

const styles = {
  pageStyle: {
    backgroundColor: 'white',
    flex: 1,
    paddingTop: (Platform.OS === 'ios') ? 15 : 0
  },
  searchContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    marginTop: 10,
    marginHorizontal: 25,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 15
  },
  searchTextStyle: {
    fontSize: 15,
    color: 'rgba(0,0,0,0.2)',
    letterSpacing: 1
  }
};

const {
  pageStyle,
  searchContainerStyle,
  searchTextStyle
} = styles;

function mapStateToProps({ loading, sorting }) {
  return { loading, sorting };
}

export default connect(mapStateToProps, { setLoading })(HomePage);
