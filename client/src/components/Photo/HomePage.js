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
import {
  Text, View, TouchableOpacity, Dimensions,
  Platform, Modal, AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
//import Spinner from 'react-native-loading-spinner-overlay';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { TabNavigator, TabBarTop } from 'react-navigation';
//import request from '../../helpers/axioshelper';
//import { photoRequest } from '../../helpers/URL';
import HotPage from './HotPage';
import NewPage from './NewPage';
import PhotoList from './PhotoList';
import SearchPage from './SearchPage';
import { setLoading } from '../../actions/index';
import { tabWidth, tabHeight, horizontalPadding } from '../../Base';
import request from '../../helpers/axioshelper';
import { filterRequest } from '../../helpers/URL';
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

  state = { filterList: [], modalVisible: false, filter: '' };

  getFilterList(filter) {
    console.log('hi albert its me');
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      AsyncStorage.getItem('SearchRadius').then(radius => {
        request.get(filterRequest(filter, lat, lng, parseInt(radius, 10)))
        .then(response => {
          this.setState({ filter, modalVisible: false, filterList: response.data });
        })
        .catch(e => request.showErrorAlert(e));
      });
    });
  }

  refreshListView() {
    this.setState({ refreshing: true }, () => this.getPhotoList());
  }

  renderList() {
    if (this.state.filter) {
      return <PhotoList list={this.state.filterList} />;
    }
    return <HomeNavigator />;
  }

  render() {
    const placeholder = this.state.filter || 'Search';
    return (
      <View style={pageStyle}>
        <Modal
          animationType='fade'
          transparent
          visible={this.state.modalVisible}
        >
          <SearchPage
            onCancel={() => this.setState({ modalVisible: false, filter: '' })}
            selectFilter={filter => this.getFilterList(filter)}
          />
        </Modal>
        <View style={searchContainerStyle}>
          <Icon.Button
            name='search'
            color='rgba(0,0,0,0.34)'
            backgroundColor='transparent'
            underlayColor='transparent'
            size={19}
            style={searchButtonStyle}
            onPress={() => this.setState({ modalVisible: true })}
          >
            <Text style={searchTextStyle}>{placeholder}</Text>
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
        {this.renderList()}
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
  swipeEnabled: false,
  animationEnabled: Platform.OS === 'ios',
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
      overflow: 'hidden',
      elevation: 0,
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
    height: 32,
    marginTop: 10,
    marginHorizontal: 25,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 10,
  },
  searchButtonStyle: {
    flex: 1,
    width: Dimensions.get('window').width - 50,
    justifyContent: 'center',
    alignItems: 'center'
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
  searchTextStyle,
  searchButtonStyle
} = styles;

function mapStateToProps({ loading, sorting }) {
  return { loading, sorting };
}

export default connect(mapStateToProps, { setLoading })(HomePage);
