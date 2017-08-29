/******************************************************************************
 * Called by: Headbar
 * Dependencies: redux
 *
 * Description: The hot/new bar. Updates a global sorting order for the home
 * page (Photo/PhotoList) through redux.
 *
 ******************************************************************************/

// The hot/new button

import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { changeSorting } from '../../actions/index';

class OrderToggler extends Component {
  constructor(props) {
    super(props);
    this.onSelectHot = this.onSelectHot.bind(this);
    this.onSelectNew = this.onSelectNew.bind(this);
  }

  onSelectHot() {
    if (this.props.sorting === 'new') {
      this.props.changeSorting('hot');
      this.props.update(); // Refresh the photo list
    }
  }

  onSelectNew() {
    if (this.props.sorting === 'hot') {
      this.props.changeSorting('new');
      this.props.update(); // Refresh the photo list
    }
  }

  render() {
    const {
      orderSelectedStyle,
      orderUnselectedStyle,
      barSelectedStyle,
      barUnselectedStyle
    } = styles;
    const hotStyle = (this.props.sorting === 'hot') ? orderSelectedStyle : orderUnselectedStyle;
    const hotBarStyle = (this.props.sorting === 'hot') ? barSelectedStyle : barUnselectedStyle;
    const newStyle = (this.props.sorting === 'hot') ? orderUnselectedStyle : orderSelectedStyle;
    const newBarStyle = (this.props.sorting === 'hot') ? barUnselectedStyle : barSelectedStyle;
    return (
      <View style={styles.containerStyle}>
        <View style={{ flex: 0.5 }} />
        <View style={hotBarStyle}>
          <Text style={hotStyle} onPress={this.onSelectHot}>HOT</Text>
        </View>

        <View style={newBarStyle}>
          <Text style={newStyle} onPress={this.onSelectNew}>NEW</Text>
        </View>
        <View style={{ flex: 0.5 }} />
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.09)',
    height: 30,
    //paddingBottom: 5
  },
  orderSelectedStyle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '900',
    color: '#FF9700',
    fontSize: 18,
    lineHeight: 22
  },
  orderUnselectedStyle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '900',
    color: 'rgba(0, 0, 0, 0.13)',
    fontSize: 18,
    lineHeight: 22
  },
  barSelectedStyle: {
    flex: 1,
    height: 30,
    padding: 3,
    borderBottomWidth: 4,
    borderColor: '#FF9700'
  },
  barUnselectedStyle: {
    flex: 1,
    height: 30,
    padding: 3
    // justifyContent: 'center'
  }
};

function mapStateToProps({ sorting }) {
  return { sorting };
}

export default connect(mapStateToProps, { changeSorting })(OrderToggler);
