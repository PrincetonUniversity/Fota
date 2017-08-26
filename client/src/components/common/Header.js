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

const Header = (props) => {
  let marginTop = Platform.OS === 'ios' ? 15 : 0;
  if (props.iosHideStatusBar) {
    marginTop = 0;
  }
  return (
    <View style={[styles.viewStyle, { marginTop }]}>
      {props.text && <Text style={styles.headerTextStyle}>{props.text}</Text>}
      {props.children}
    </View>
)};

const styles = {
  viewStyle: {
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 10,
    position: 'relative',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.09)',
    elevation: 1
  },
  headerTextStyle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(0, 0, 0, 0.7)',
    letterSpacing: 1,
    textAlign: 'center',
    flex: 1
  },
};

export { Header };
