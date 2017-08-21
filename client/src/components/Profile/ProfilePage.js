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
import Navbar from '../Navbar';

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
    request.get(photoRequest(this.props.user)).then(response => this.setState({
      bookmarked: response.data.bookmarked,
      upvoted: response.data.upvoted,
      uploaded: response.data.uploaded,
      comments: response.data.comments,
      loading: false
    })).catch(e => request.showErrorAlert(e));
    */
    this.setState({
      bookmarked: this.props.testuser.bookmarked,
      upvoted: this.props.testuser.upvoted,
      uploaded: this.props.testuser.uploaded,
      comments: this.props.testuser.comments,
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
  }

  renderPhoto(photo, allowDelete) {
    let options = null;
    if (allowDelete) {
      options = [{ name: 'Delete', onClick: () => this.deleteFromServer(photo) }];
    }
    const restaurant = this.state.restaurants.filter(
      rest => rest.id === photo.RestaurantId
    )[0];

    return (
      <RestaurantModal
        restaurant={restaurant}
        pageStyle={{ paddingTop: (Platform.OS === 'ios') ? 15 : 0 }}
        options={options}
      >
        <Image
          key={photo.id}
          source={{ uri: photo.link }}
          style={styles.photoStyle}
        />
      </RestaurantModal>
    );
  }

  renderPhotoList(list, message, allowDelete) {
    if (!this.state.loading && list.length === 0) {
      return <Text style={styles.emptyTextStyle}>{message}</Text>;
    }
    return (
      <FlatList
        data={list}
        keyExtractor={photo => photo.id}
        renderItem={photo => this.renderPhoto(photo.item, allowDelete)}
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 10 }}
        horizontal
        removeClippedSubviews={false}
      />
    );
  }*/

  render() {
    return (/*
      <View>
        <Header><Text style={styles.headerTextStyle}>{this.props.user.email}</Text></Header>

        <CardSection>
          <Text style={styles.sectionTextStyle}>My Photos</Text>
        </CardSection>
        {this.renderPhotoList(this.state.uploaded, 'Take your first photo to see it here!', true)}

        <CardSection>
          <Text style={styles.sectionTextStyle}>My Upvotes</Text>
        </CardSection>
        {this.renderPhotoList(this.state.upvoted, 'See all your upvoted photos here!', false)}

        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <Button onPress={() => firebase.auth().signOut()}><Text>Log out</Text></Button>
        </View>
      </View>
    */
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
        <View style={headerStyle}>
          <View style={{ borderColor: '#ddd', borderBottomWidth: 1, ...headerSectionStyle }}>
            <View>
              <Text style={nameTextStyle}>{this.props.user.email}</Text>
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
              onPress={() => firebase.auth().signOut()}
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
    activeTintColor: '#ff9700',
    inactiveTintColor: '#ccc',
    labelStyle: {
      fontSize: 14,
      fontWeight: '500',
      marginVertical: 2
    },
    indicatorStyle: {
      height: 3,
      backgroundColor: '#ff9700',
      position: 'absolute',
      top: 0
    },
    style: { elevation: 0, backgroundColor: 'white' }
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
    fontFamily: 'Avenir',
    fontSize: 22,
    fontWeight: '500',
    color: '#444',
    paddingVertical: 5
  },
  infoTextStyle: {
    fontFamily: 'Avenir',
    fontSize: 17,
    fontWeight: '400',
    color: '#ff9700'
  },
  statSectionStyle: {
    alignItems: 'center',
    paddingHorizontal: 10
  },
  statNumberStyle: {
    fontFamily: 'Avenir',
    fontSize: 20,
    fontWeight: '500',
    color: '#444'
  },
  statLabelStyle: {
    fontFamily: 'Avenir',
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
