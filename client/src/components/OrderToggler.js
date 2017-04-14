// The hot/new button

import React, { Component } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import { getPhotosAndRests } from '../actions/index';

class OrderToggler extends Component {
  constructor(props) {
    super(props);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.state = { hot: true };
  }

  onButtonClick() {
    this.setState({ hot: !this.state.hot });
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      if (this.state.hot) {
        this.props.getPhotosAndRests('hot', lat, lng);
      } else {
        this.props.getPhotosAndRests('new', lat, lng);
      }
    });
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.containerStyle}
        onPress={this.onButtonClick}
      >
        <Text>{this.state.hot ? 'Hot' : 'New'}</Text>
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

export default connect(null, { getPhotosAndRests })(OrderToggler);
