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
import { View, AsyncStorage, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/Foundation';
import request from '../../helpers/axioshelper';
import { photoRequest } from '../../helpers/URL';
import PhotoList from './PhotoList';
import Headbar from './Headbar';
import { setLoading } from '../../actions/index';
import { tabWidth, tabHeight } from '../../Base';

class HomePage extends Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarIcon: ({ focused }) => {
      let color = '#ccc';
      if (focused) color = '#ff9700';
      return (
        <TouchableOpacity
          style={{
            width: tabWidth,
            height: tabHeight,
            justifyContent: 'center',
            alignItems: 'center'
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
            size={38}
          />
        </TouchableOpacity>
        
      );
    }
  });

  state = { photoList: [], loading: true, refreshing: false };
    
  componentWillMount() {
    this.getPhotoList();
  }

  getPhotoList() {
    if (!this.state.refreshing) {
      this.props.setLoading(true);
    }
    navigator.geolocation.getCurrentPosition(position => {
      const lat = 40.34; // position.coords.latitude
      const lng = -74.656; // position.coords.longitude
      AsyncStorage.getItem('SearchRadius').then(radius => {
        request.get(photoRequest(this.props.sorting, lat, lng, parseInt(radius, 10)))
        .then(response => {
          this.props.setLoading(false);
          this.setState({ photoList: response.data, refreshing: false });
        })
        .catch(e => request.showErrorAlert(e));
      });
    });
  }

  refreshListView() {
    this.setState({ refreshing: true }, () => this.getPhotoList());
  }

  render() {
    if (this.props.loading) {
      return (
        <View>
          <Headbar />
          <Spinner visible color='#ff9700' />
        </View>
      );
    }
    return (
      <View style={{ backgroundColor: '#FFFFFF' }}>
        <Headbar update={this.getPhotoList.bind(this)} />
        <PhotoList 
          list={this.state.photoList}
          //extraData={Headbar}
          //header={() => <Headbar update={this.getPhotoList.bind(this)} />}
          onRefresh={() => this.refreshListView()}
          refreshing={this.state.refreshing}
        />
      </View>
    );
  }
}

function mapStateToProps({ loading, sorting }) {
  return { loading, sorting };
}

export default connect(mapStateToProps, { setLoading })(HomePage);
