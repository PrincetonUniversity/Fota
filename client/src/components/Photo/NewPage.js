import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import request from '../../helpers/axioshelper';
import { setLoading } from '../../actions/index';
import { photoRequest } from '../../helpers/URL';
import PhotoList from './PhotoList';

class NewPage extends Component {
  state = { photoList: [], loading: true, refreshing: false };
  
  componentWillMount() {
    this.getPhotoList();
  }

  getPhotoList() {
    if (!this.state.refreshing) {
      this.props.setLoading(true);
    }
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      AsyncStorage.getItem('SearchRadius').then(radius => {
        request.get(photoRequest('new', lat, lng, parseInt(radius, 10)))
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
    return (
      <PhotoList
        list={this.state.photoList}
        onRefresh={() => this.refreshListView()}
        refreshing={this.state.refreshing}
      />
    );
  }
}

function mapStateToProps({ loading }) {
  return { loading };
}

export default connect(mapStateToProps, { setLoading })(NewPage);
