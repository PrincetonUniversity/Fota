/******************************************************************************
 * Called by: Base
 * Dependencies: common/Header
 *
 * Description: Settings page accessed through the bottom navigation bar.
 * Allows the user to select from different options for search radius
 * (Photo/PhotoList), and stores it in async storage.
 *
 ******************************************************************************/

import React from 'react';
import { View, WebView } from 'react-native';
import { Header } from '../common';
import { BackButton } from './SettingsPage';

const SettingsWebView = (props) => (
  <View style={{ flex: 1 }}>
    <Header text={props.title}>
      <BackButton onPress={() => props.navigation.goBack()} />
    </Header>
    <WebView source={props.source} />
  </View>
);

export default SettingsWebView;
