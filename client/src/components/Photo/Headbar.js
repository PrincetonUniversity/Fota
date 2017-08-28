/******************************************************************************
 * Called by: Photo/PhotoList
 * Dependencies: common/Header, OrderToggler
 *
 * Description: Header at the top of the home page (Photo/PhotoList). Contains
 * the hot/new tab (OrderToggler).
 *
 ******************************************************************************/

import React from 'react';
import { View, Image, Platform } from 'react-native';
import { Input } from '../common';
import OrderToggler from './OrderToggler';

const Headbar = ({ update }) => (
  <View style={styles.headerStyle}>
    <Input
      style={styles.searchContainerStyle}
      placeholder='Search'
      placeholderAlign='center'
      //value={this.state.query}
      //onChangeText={query => this.updateQuery(query)}
    >
        <Image
          style={styles.labelStyle}
          source={require('../../img/magnifying_glass_unactivated.png')}
        />
    </Input>
    {/* <View style={styles.toggleStyle}><OrderToggler update={update} /></View> */}
  </View>
);

const styles = {
  headerStyle: {
    alignItems: 'center',
    height: 85, //85
    marginTop: (Platform.OS === 'ios') ? 15 : 0,
    position: 'relative',
    flexDirection: 'column'
  },
  labelStyle: {
    width: 15,
    height: 15,
    marginLeft: 7,
    marginRight: 5
  },
  searchContainerStyle: {
    //alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.45)',
   //marginTop: 12,
    marginHorizontal: 35,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.4)',
    height: 31
  },
  toggleStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1
  },
  linearGradient: {
    flex: 1,
    //paddingLeft: 15,
    //paddingRight: 15,
  }
};

export default Headbar;
