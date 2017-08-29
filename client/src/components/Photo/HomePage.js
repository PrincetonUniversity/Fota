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
  Platform, Modal, AsyncStorage, Image
} from 'react-native';
import { connect } from 'react-redux';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { TabNavigator, TabBarTop } from 'react-navigation';
import PhotoFeed from './PhotoFeed';
import PhotoList from './PhotoList';
import SearchPage from './SearchPage';
import { browseFromPrinceton } from '../../actions';
import { tabWidth, tabHeight, horizontalPadding, pcoords } from '../../Base';
import request from '../../helpers/axioshelper';
import { filterRequest } from '../../helpers/URL';
import icoMoonConfig from '../../selection.json';

const Icon = createIconSetFromIcoMoon(icoMoonConfig);
const noPhotosImage = require('../../img/no_photos_found.png');

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

  state = { noPhotos: false, filterList: [], modalVisible: false, filter: '' };

  getFilterList(filter) {
    if (this.props.browsingPrinceton) {
      this.sendPhotoRequest(filter, pcoords.lat, pcoords.lng);
    } else {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.sendPhotoRequest(filter, lat, lng);
      });
    }
  }

  sendPhotoRequest(filter, lat, lng) {
    AsyncStorage.getItem('SearchRadius').then(radius => {
      request.get(filterRequest(filter, lat, lng, parseInt(radius, 10)))
      .then(response => {
        this.setState({ filter, modalVisible: false, filterList: response.data });
      })
      .catch(e => request.showErrorAlert(e));
    });
  }

  refreshListView() {
    this.setState({ refreshing: true }, () => this.getPhotoList());
  }

  renderList() {
    if (this.state.filter) {
      return <PhotoList list={this.state.filterList} />;
    }
    return (
      <HomeNavigator
        screenProps={{
          noPhotos: () => this.setState({ noPhotos: true })
        }}
      />
    );
  }

  render() {
    const placeholder = this.state.filter || 'Search';
    if (this.state.noPhotos) {
      return (
        <View style={noPhotosPageStyle}>
          <Text style={noPhotosTextStyle}>Sorry, we're not available in your location yet!</Text>
          <Image style={noPhotosImageStyle} source={noPhotosImage} />
          <TouchableOpacity
            onPress={() => {
              this.props.browseFromPrinceton(true);
              this.setState({ noPhotos: false });
            }}
          >
            <View>
              <Text style={noPhotosButtonStyle}>Browse from Princeton, NJ</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={pageStyle}>
        <Modal
          animationType='fade'
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false, filter: '' })}
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
        {this.renderList()}
      </View>
    );
  }
}

const HotPage = (props) => <PhotoFeed order='hot' noPhotos={props.screenProps.noPhotos} />;
const NewPage = () => <PhotoFeed order='new' />;

const HomeNavigator = TabNavigator({
  Hot: { screen: HotPage },
  New: { screen: NewPage }
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
      justifyContent: 'center',
    },
    tabStyle: {
      width: 120,
      padding: 5
    },
    style: {
      backgroundColor: 'white',
      marginHorizontal: Dimensions.get('window').width / 2 - 120,
      overflow: 'hidden',
      elevation: 0,
    }
  }
});

const styles = {
  pageStyle: {
    backgroundColor: 'white',
    flex: 1,
    paddingTop: (Platform.OS === 'ios') ? 15 : 0
  },
  noPhotosPageStyle: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 75,
    paddingVertical: 50,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  noPhotosTextStyle: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center'
  },
  noPhotosImageStyle: {
    width: Dimensions.get('window').width - 150,
    height: Dimensions.get('window').width - 150
  },
  noPhotosButtonStyle: {
    color: '#2494ff',
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center'
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
  noPhotosPageStyle,
  noPhotosTextStyle,
  noPhotosImageStyle,
  noPhotosButtonStyle,
  searchContainerStyle,
  searchTextStyle,
  searchButtonStyle
} = styles;

function mapStateToProps({ browsingPrinceton }) {
  return { browsingPrinceton };
}

export default connect(mapStateToProps, { browseFromPrinceton })(HomePage);
