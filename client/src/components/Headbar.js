/******************************************************************************
 * Called by: Photo/PhotoList
 * Dependencies: common/Header, OrderToggler
 *
 * Description: Header at the top of the home page (Photo/PhotoList). Contains
 * the hot/new tab (OrderToggler).
 *
 ******************************************************************************/

import React from 'react';
import { View, Image } from 'react-native';
import { GradientHeader, Input } from './common';
import OrderToggler from './OrderToggler';

const Headbar = ({ update }) => (
  <GradientHeader
    start={{ x: 0.0, y: 0.1 }}
    end={{ x: 1.0, y: 1.0 }}
    colors={['#FF9700', '#FFC200']}
    style={styles.linearGradient}
  >
    <Input
      style={styles.searchContainerStyle}
      placeholder='Search for a restaurant'
      //value={this.state.query}
      //onChangeText={query => this.updateQuery(query)}
    >
      <Image
        style={styles.labelStyle}
        source={require('../img/magnifying_glass_unactivated.png')}
      />
    </Input>
    <View style={styles.toggleStyle}><OrderToggler update={update} /></View>
  </GradientHeader>
);

const styles = {
  labelStyle: {
    width: 15,
    height: 15,
    marginLeft: 7,
    marginRight: 5
  },
  searchContainerStyle: {
    backgroundColor: 'rgba(255,255,255,0.45)',
    marginTop: 12,
    //marginBottom: 1,
    marginHorizontal: 35,
    borderRadius: 8,
    height: 31
  },
  toggleStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  linearGradient: {
    flex: 1,
    //paddingLeft: 15,
    //paddingRight: 15,
  }
};

export default Headbar;
