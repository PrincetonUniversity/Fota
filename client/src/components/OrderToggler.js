// The hot/new button

import React, { Component } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import { getPhotosAndRests, loadingTrue, changeSorting } from '../actions/index';

class OrderToggler extends Component {
  constructor(props) {
    super(props);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onButtonClick() {
    this.props.loadingTrue();

    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      if (this.props.sorting === 'hot') {
        this.props.getPhotosAndRests('new', lat, lng);
        this.props.changeSorting('new');
      } else {
        this.props.getPhotosAndRests('hot', lat, lng);
        this.props.changeSorting('hot');
      }
    });
  }

  render() {
    let text = '';
    if (this.props.sorting === 'hot') text = 'Hot';
    else text = 'New';
    return (
      <TouchableOpacity
        style={styles.containerStyle}
        onPress={this.onButtonClick}
      >
        <Text>{text}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
};

function mapStateToProps({ sorting }) {
  return { sorting };
}

export default connect(mapStateToProps, { getPhotosAndRests, loadingTrue, changeSorting })(OrderToggler);
