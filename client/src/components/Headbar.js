/******************************************************************************
 * Called by: Photo/PhotoList
 * Dependencies: common/Header, OrderToggler
 *
 * Description: Header at the top of the home page (Photo/PhotoList). Contains
 * the hot/new tab (OrderToggler).
 *
 ******************************************************************************/

// Header at the top with order toggle

import React from 'react';
import { View } from 'react-native';
import { Header } from './common';
import OrderToggler from './OrderToggler';

const Headbar = ({ update }) => (
  <Header>
    <View style={styles.toggleStyle}><OrderToggler update={update} /></View>
  </Header>
);

const styles = {
  searchStyle: {
    textAlign: 'center',
    flex: 2
  },
  toggleStyle: {
    alignItems: 'stretch',
    flex: 1,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
};

export default Headbar;
