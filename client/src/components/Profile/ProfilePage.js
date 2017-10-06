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
import { Text, View, Platform, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { TabNavigator, TabBarTop } from 'react-navigation';
import Ionicon from 'react-native-vector-icons/Ionicons';
import BookmarkedRestaurants from './BookmarkedRestaurants';
import UpvotedPhotos from './UpvotedPhotos';
import UploadedPhotos from './UploadedPhotos';
import SubmittedComments from './SubmittedComments';
import { setProfileReloader } from '../../actions';
import request from '../../helpers/axioshelper';
import { profileRequest } from '../../helpers/URL';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarked: [],
      upvoted: [],
      uploaded: [],
      comments: [],
      loading: true,
      refreshing: false,
      noInternet: false
    };
  }

  componentWillMount() {
    this.reloadProfile(false);
    this.props.setProfileReloader(() => this.reloadProfile(false));
  }

  reloadProfile(refresh) {
    if (refresh) {
      this.setState({ refreshing: true });
    } else {
      this.setState({ loading: true });
    }
    request.get(profileRequest()).then(response => {
      this.setState({
        bookmarked: response.data.bookmarks,
        upvoted: response.data.upvoted_photos,
        uploaded: response.data.uploaded_photos,
        comments: response.data.written_comments,
        loading: false,
        refreshing: false
      });
    }).catch(e => {
      this.setState({ loading: false, refreshing: false, noInternet: true });
      request.showErrorAlert(e);
    });
  }

  updateWithDeletedPhoto(id) {
    const newUploaded = this.state.uploaded.filter(photo => photo.id !== id);
    this.props.navigateToNew(false); // Update redux table !!
    this.setState({ uploaded: newUploaded });
  }

  render() {
    const name = this.props.screenProps.user.displayName || this.props.screenProps.user.email;
    let uploadtext = '--';
    let upvotetext = '--';
    let commenttext = '--';
    let uploadInfo = 'posts';
    let upvoteInfo = 'upvotes';
    let commentInfo = 'comments';
    if (!this.state.loading && !this.state.noInternet) {
      uploadtext = this.state.uploaded.length.toString();
      upvotetext = this.state.upvoted.length.toString();
      commenttext = this.state.comments.length.toString();
      if (this.state.uploaded.length === 1) {
        uploadInfo = 'post';
      }
      if (this.state.upvoted.length === 1) {
        upvoteInfo = 'upvote';
      }
      if (this.state.comments.length === 1) {
        commentInfo = 'comment';
      }
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
                  color={'#ff7f00'}
                  size={17}
                  style={{ alignSelf: 'center', paddingRight: 5 }}
                />
                <Text style={infoTextStyle}>Beta Tester</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Settings')}
            >
              <Ionicon
                name={'md-settings'}
                backgroundColor={'#fff'}
                color={'rgba(0,0,0,0.15)'}
                size={27}
                style={{ marginTop: 17 }}
              />
            </TouchableOpacity>

          </View>

          <View style={statContainerStyle}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <View style={statSectionStyle}>
                <Text style={[statNumberStyle, { marginRight: 1 }]}>{upvotetext}</Text>
                <Text style={statLabelStyle}>{upvoteInfo}</Text>
              </View>
            </View>

            <View style={statSectionStyle}>
              <Text style={statNumberStyle}>{uploadtext}</Text>
              <Text style={statLabelStyle}>{uploadInfo}</Text>
            </View>

            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={statSectionStyle}>
                <Text style={[statNumberStyle, { marginRight: 3 }]}>{commenttext}</Text>
                <Text style={statLabelStyle}>{commentInfo}</Text>
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
            loading: this.state.loading,
            refreshing: this.state.refreshing,
            refreshPage: () => this.reloadProfile(true),
            updateWithDeletedPhoto: id => this.updateWithDeletedPhoto(id)
          }}
        />
      </View>
    );
  }
}

const ProfileNavigator = TabNavigator({
  Upvotes: {
    screen: UpvotedPhotos
  },
  Bookmarks: {
    screen: BookmarkedRestaurants
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
  swipeEnabled: true,
  animationEnabled: true,
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
    color: '#ff7f00'
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
    includeFontPadding: false,
    height: 25
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

function mapStateToProps({ navigateToNew }) {
  return { navigateToNew };
}

export default connect(mapStateToProps, { setProfileReloader })(ProfilePage);
