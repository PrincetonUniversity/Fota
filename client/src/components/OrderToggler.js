// The hot/new button

import React, { Component } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { bindActionCreators } from 'redux';
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
    if (this.state.hot) {
      this.props.getPhotosAndRests('new');
    } else {
      this.props.getPhotosAndRests('hot');
    }
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
