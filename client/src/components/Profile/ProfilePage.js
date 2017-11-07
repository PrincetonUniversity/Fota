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
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import BookmarkedRestaurants from './BookmarkedRestaurants';
import UpvotedPhotos from './UpvotedPhotos';
import UploadedPhotos from './UploadedPhotos';
import SubmittedComments from './SubmittedComments';
import { setProfileReloader } from '../../actions';
import request from '../../helpers/axioshelper';
import { profileRequest, rewardRequest } from '../../helpers/URL';
import { NECESSARY_REVIEWS, NECESSARY_UPLOADS, NECESSARY_UPVOTES } from './RewardsPage';
import icoMoonConfig from '../../selection.json';

const Icon = createIconSetFromIcoMoon(icoMoonConfig);

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
    const promises = [
      request.get(profileRequest()),
      request.get(rewardRequest()),
    ];
    Promise.all(promises).then(result => {
      this.setState({
        bookmarked: result[0].data.bookmarks,
        upvoted: result[0].data.upvoted_photos,
        uploaded: result[0].data.uploaded_photos,
        comments: result[0].data.written_comments,
        loading: false,
        refreshing: false
      });
      const uv = parseInt(result[1].data.upvotes);
      const up = parseInt(result[1].data.uploads);
      const rv = parseInt(result[1].data.comments);
      this.props.screenProps.setRewardState({
        upvotes: Math.min(NECESSARY_UPVOTES, uv),
        uploads: Math.min(NECESSARY_UPLOADS, up),
        reviews: Math.min(NECESSARY_REVIEWS, rv),
        complete: uv >= NECESSARY_UPVOTES && up >= NECESSARY_UPLOADS && rv >= NECESSARY_REVIEWS
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

    //const rewardColor = this.props.screenProps.rewardState.complete ? '#ff7f00' : 'rgba(0,0,0,0.15)';

    return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
        <View style={headerStyle}>
          <View style={headerSectionStyle} >
            <View style={{ justifyContent: 'center' }}>
              <Text style={nameTextStyle}>{name}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Rewards')}
              >
                <View style={{ backgroundColor: '#ff5522', width: 40, height: 40, borderRadius: 20, overflow: 'hidden' }}>
                  <Icon
                    name={'rewards'}
                    backgroundColor={'transparent'}
                    color={'#fff'}
                    size={25}
                    style={{ marginTop: 7, textAlign: 'center' }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Settings')}
              >
                <Ionicon
                  name={'md-settings'}
                  backgroundColor={'#fff'}
                  color={'rgba(0,0,0,0.15)'}
                  size={27}
                  style={{ marginLeft: 15, marginTop: 7 }}
                />
              </TouchableOpacity>
            </View>
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
