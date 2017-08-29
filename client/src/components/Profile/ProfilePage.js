/******************************************************************************
 * Called by: ./AccountPage
 * Dependencies: firebase, helpers/axioshelper, common/Header, common/Button,
 * common/CardSection, Restaurant/RestaurantModal
 *
 * Description: Called when the user accesses the account page (./AccountPage)
 * after logging in. Displays a list of user-uploaded photos, liked photos,
 * and a log out button.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { Text, View, Platform } from 'react-native';
import firebase from 'firebase';
import { TabNavigator, TabBarTop } from 'react-navigation';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { profileRequest } from '../../helpers/URL';
import { tabHeight } from '../../Base';
import BookmarkedRestaurants from './BookmarkedRestaurants';
import UpvotedPhotos from './UpvotedPhotos';
import UploadedPhotos from './UploadedPhotos';
import SubmittedComments from './SubmittedComments';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      bookmarked: [],
      upvoted: [],
      uploaded: [],
      comments: [],
      deleting: false,
      loading: true
    };
    this.deleting = false;
  }

  componentWillMount() {
    /*
    request.get(photoRequest(this.props.screenProps.user)).then(response => this.setState({
      bookmarked: response.data.bookmarked,
      upvoted: response.data.upvoted,
      uploaded: response.data.uploaded,
      comments: response.data.comments,
      loading: false
    })).catch(e => request.showErrorAlert(e));
    */
    this.setState({
      bookmarked: this.props.screenProps.testuser.bookmarked,
      upvoted: this.props.screenProps.testuser.upvoted,
      uploaded: this.props.screenProps.testuser.uploaded,
      comments: this.props.screenProps.testuser.comments,
      loading: false
    });
  }

  /*deleteFromServer(photo) {
    if (this.deleting) {
      return;
    }
    this.deleting = true;
    request.delete('https://fotafood.herokuapp.com/api/photo', { id: photo.id })
    .then(() => {
      this.deleting = false;
      const newUploaded = [];
      for (const item of this.state.uploaded) {
        if (item.id !== photo.id) newUploaded.push(item);
      }
      this.setState({ uploaded: newUploaded });
    })
    .catch(e => request.showErrorAlert(e));
  }*/

  render() {
    let name = this.props.screenProps.user.displayName;
    if (!name) {
      name = this.props.screenProps.user.email;
    }
    return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
        <View style={headerStyle}>
          <View style={headerSectionStyle} >
            <View>
              <Text style={nameTextStyle}>{name}</Text>
              <View style={{ flexDirection: 'row', paddingBottom: 10 }} >
                <Ionicon 
                  name={'md-star'} 
                  color={'#ff9700'}
                  size={17}
                  style={{ alignSelf: 'center', paddingRight: 5 }}
                />
                <Text style={infoTextStyle}>Certified Foodie</Text>
              </View>
            </View>
            <Ionicon
              name={'md-settings'}
              backgroundColor={'#fff'}
              color={'rgba(0,0,0,0.15)'}
              size={27}
              onPress={() => this.props.navigation.navigate('Settings')}
              style={{ marginTop: 17 }}
            />
          </View>

          <View style={statContainerStyle}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <View style={statSectionStyle}>
                <View style={{ height: 25 }}>
                  <Text style={[statNumberStyle, { marginRight: 1 }]}>{this.state.uploaded.length.toString()}</Text>
                </View>
                <Text style={statLabelStyle}>posts</Text>
              </View>
            </View>

            <View style={statSectionStyle}>
              <View style={{ height: 25 }}>
                <Text style={statNumberStyle}>{this.state.upvoted.length.toString()}</Text>
              </View>
              <Text style={statLabelStyle}>total upvotes</Text>
            </View>

            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={statSectionStyle}>
                <View style={{ height: 25 }}>
                  <Text style={[statNumberStyle, { marginRight: 3 }]}>{this.state.comments.length.toString()}</Text>
                </View>
                <Text style={statLabelStyle}>reviews</Text>
              </View>
            </View>
          </View>
        </View>

        <ProfileNavigator 
          screenProps={{
            bookmarked: this.state.bookmarked,
            uploaded: this.state.uploaded,
            upvoted: this.state.upvoted,
            comments: this.state.comments,
          }}
        />
      </View>
    );
  }
}

const ProfileNavigator = TabNavigator({
  Bookmarks: {
    screen: BookmarkedRestaurants
  },
  Uploads: {
    screen: UploadedPhotos
  },
  Upvotes: {
    screen: UpvotedPhotos
  },
  Comments: {
    screen: SubmittedComments
  }
},
{
  tabBarPosition: 'top',
  tabBarComponent: TabBarTop,
  tabBarOptions: {
    showIcon: true,
    showLabel: false,
    indicatorStyle: {
      height: 0,
    },
    tabStyle: {
      marginVertical: 10,
      paddingVertical: 0,
      borderRightWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.09)'
    },
    style: {
      marginTop: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
      elevation: 0,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.09)'
    },
    iconStyle: {
      height: 30,
      width: 30
    }
  }
});

const styles = {
  headerStyle: {
    marginTop: (Platform.OS === 'ios') ? 15 : 0,
  },
  headerSectionStyle: { 
    borderColor: 'rgba(0, 0, 0, 0.09)',
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingBottom: 5,
    marginHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameTextStyle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(0, 0, 0, 0.81)',
    paddingVertical: 5
  },
  infoTextStyle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#ff9700'
  },
  statContainerStyle: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 5
  },
  statSectionStyle: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  statNumberStyle: {
    fontSize: 20,
    fontWeight: '900',
    color: 'rgba(0, 0, 0, 0.75)',
    includeFontPadding: false
  },
  statLabelStyle: {
    fontSize: 13,
    fontWeight: '300',
    color: 'rgba(0,0,0,0.75)',
  },
};

const {
  headerStyle,
  headerSectionStyle,
  statContainerStyle,
  nameTextStyle,
  infoTextStyle,
  statSectionStyle,
  statNumberStyle,
  statLabelStyle
} = styles;

export default ProfilePage;
