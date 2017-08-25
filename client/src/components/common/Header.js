/******************************************************************************
 * Called by: Account/AccountPage, Account/UserPage, Camera/CameraCommentsPage,
 * Camera/CameraLocationPage, Camera/CameraPage, ./BlankPage, ./Headbar,
 * Photo/PhotoList, Restaurant/CommentUpload, Restaurant/RestaurantDetail,
 * Search/SearchPage, Settings/SettingsPage
 * Dependencies:
 *
 * Description: Visual component for a spaced header at the top of a page.
 *
 ******************************************************************************/

import React from 'react';
import { View, Platform, Text } from 'react-native';

const Header = (props) => (
  <View style={styles.viewStyle}>
    {props.text && <Text style={styles.headerTextStyle}>{props.text}</Text>}
    {props.children}
  </View>
);

const styles = {
  viewStyle: {
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    marginTop: (Platform.OS === 'ios') ? 15 : 0,
    paddingHorizontal: 10,
    position: 'relative',
    flexDirection: 'row',
    elevation: 1
  },
  headerTextStyle: {
    fontSize: 16,
    fontWeight: '900',
    color: 'rgba(0, 0, 0, 0.7)',
    textAlign: 'center',
    flex: 1
  },
};

export { Header };
