// The hot/new button

import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, Text } from 'react-native';
import { connect } from 'react-redux';
import { changeSorting } from '../actions/index';

class OrderToggler extends Component {
  constructor(props) {
    super(props);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onButtonClick() {
    if (this.props.sorting === 'hot') {
      this.props.changeSorting('new');
    } else {
      this.props.changeSorting('hot');
    }
    this.props.update();
  }

  render() {
    const { selectedStyle, unselectedStyle } = styles;
    const hotStyle = (this.props.sorting === 'hot') ? selectedStyle : unselectedStyle;
    const newStyle = (this.props.sorting === 'hot') ? unselectedStyle : selectedStyle;
    return (
      <TouchableWithoutFeedback
        onPress={this.onButtonClick}
      >
        <View style={styles.containerStyle}>
          <Text style={hotStyle}> Hot</Text>
          <Text style={newStyle}> New</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: 'row',
    paddingHorizontal: 9,
    justifyContent: 'flex-end'
  },
  selectedStyle: {
    paddingHorizontal: 8,
    paddingTop: 3,
    backgroundColor: '#ff9700',
    color: '#fff',
    borderColor: '#ff9700',
    borderWidth: 2
  },
  unselectedStyle: {
    paddingHorizontal: 8,
    paddingTop: 3,
    backgroundColor: '#fff',
    color: '#ff9700',
    borderColor: '#ff9700',
    borderWidth: 2
  }
};

function mapStateToProps({ sorting }) {
  return { sorting };
}

export default connect(mapStateToProps, { changeSorting })(OrderToggler);
