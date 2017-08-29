import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import request from '../../helpers/axioshelper';
import { setLoading } from '../../actions/index';
import { photoRequest } from '../../helpers/URL';
import PhotoList from './PhotoList';
import LoadingPhotos from './LoadingPhotos';
import { pcoords } from '../../Base';

class PhotoFeed extends Component {
  state = { photoList: [], refreshing: false };
  
  componentWillMount() {
    this.getPhotoList();
  }

  getPhotoList() {
    if (!this.state.refreshing) {
      this.props.setLoading(true);
    }
    if (this.props.browsingPrinceton) {
      this.sendPhotoRequest(pcoords.lat, pcoords.lng);
    } else {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = 0;//position.coords.latitude;
        const lng = 0;//position.coords.longitude;
        this.sendPhotoRequest(lat, lng);
      });
    }
  }

  sendPhotoRequest(lat, lng) {
    AsyncStorage.getItem('SearchRadius').then(radius => {
      request.get(photoRequest(this.props.order, lat, lng, parseInt(radius, 10)))
      .then(response => {
        this.props.setLoading(false);        
        if (response.data.length === 0) {
          if (this.props.noPhotos) this.props.noPhotos();
        } else {
          this.setState({ photoList: response.data, refreshing: false });          
        }
      })
      .catch(e => request.showErrorAlert(e));
    });
  }

  refreshListView() {
    this.setState({ refreshing: true }, () => this.getPhotoList());
  }
  
  render() {
    if (this.props.loading) return <LoadingPhotos />;    
    return (
      <View style={{ flex: 1, borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.09)' }} >
        <PhotoList
          list={this.state.photoList}
          onRefresh={() => this.refreshListView()}
          refreshing={this.state.refreshing}
        />
      </View>
    );
  }
}

function mapStateToProps({ loading, browsingPrinceton }) {
  return { loading, browsingPrinceton };
}

export default connect(mapStateToProps, { setLoading })(PhotoFeed);
