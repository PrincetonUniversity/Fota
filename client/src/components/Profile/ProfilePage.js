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
          <View style={{ borderColor: '#ddd', borderBottomWidth: 1, ...headerSectionStyle }}>
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
            <Ionicon.Button
              name={'md-settings'}
              backgroundColor={'#fff'}
              color={'#ccc'}
              size={30}
              onPress={() => this.props.navigation.navigate('Settings')}
              style={{ marginTop: 10 }}
            />
          </View>

          <View style={headerSectionStyle}>
            <View style={statSectionStyle}>
              <Text style={statNumberStyle}>{this.state.uploaded.length.toString()}</Text>
              <Text style={statLabelStyle}>posts</Text>
            </View>

            <View style={statSectionStyle}>
              <Text style={statNumberStyle}>{this.state.upvoted.length.toString()}</Text>
              <Text style={statLabelStyle}>total upvotes</Text>
            </View>

            <View style={statSectionStyle}>
              <Text style={statNumberStyle}>{this.state.comments.length.toString()}</Text>
              <Text style={statLabelStyle}>reviews</Text>
            </View>
          </View>
        </View>

        <ProfileNavigator 
          screenProps={{
            bookmarked: this.state.bookmarked,
            upvoted: this.state.upvoted,
            uploaded: this.state.uploaded,
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
  Upvotes: {
    screen: UpvotedPhotos
  },
  Uploads: {
    screen: UploadedPhotos
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
      paddingVertical: 3,
      borderRightWidth: 1,
      borderColor: '#e0e0e0'
    },
    style: {
      marginTop: 10,
      backgroundColor: '#f8f8f8',
      elevation: 0,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: '#e8e8e8'
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
    paddingHorizontal: 40,
  },
  headerSectionStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  nameTextStyle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#444',
    paddingVertical: 5
  },
  infoTextStyle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#ff9700'
  },
  statSectionStyle: {
    alignItems: 'center',
    paddingHorizontal: 10
  },
  statNumberStyle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#444'
  },
  statLabelStyle: {
    fontSize: 15,
    color: '#aaa'
  },
};

const {
  headerStyle,
  headerSectionStyle,
  nameTextStyle,
  infoTextStyle,
  statSectionStyle,
  statNumberStyle,
  statLabelStyle
} = styles;

export default ProfilePage;
