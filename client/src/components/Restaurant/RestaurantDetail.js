/******************************************************************************
 * Called by: ./RestaurantModal
 * Dependencies: moment (date/time package), phonecall, helpers/axioshelper,
 * common/Button, common/ImageButton, common/FilterDisplay, ./CommentDetail
 *
 * Description: Base restaurant page that displays all the restaurant info.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import {
  View, Text, Animated, Linking, LayoutAnimation, Dimensions, Platform,
  TouchableWithoutFeedback, TouchableOpacity, UIManager, StatusBar, Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { TabNavigator } from 'react-navigation';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { phonecall } from 'react-native-communications';
import LinearGradient from 'react-native-linear-gradient';
import { Banner } from '../common';
import request from '../../helpers/axioshelper';
import {
  restBookmarkRequest, directionsRequest,
  directionsURL, restRecommendRequest
} from '../../helpers/URL';
import FilterBar from './FilterBar';
import RestaurantPhotos from './RestaurantPhotos';
import RestaurantComments from './RestaurantComments';
import LoadingRestaurants from './LoadingRestaurants';
import { pcoords } from '../../Base';
import icoMoonConfig from '../../selection.json';

const Icon = createIconSetFromIcoMoon(icoMoonConfig);
const DollarSign = () => (
  <FoundationIcon
    name='dollar'
    size={30}
    style={{ height: 30, marginHorizontal: 1 }}
    color={'rgba(0,0,0,0.63)'}
  />
);

const PHOTO_HEIGHT = (Dimensions.get('window').width - 14) / 3;

class RestaurantDetail extends Component {
  constructor(props) {
    super(props);

    // const panResponder = PanResponder.create({
    //   onStartShouldSetPanResponder: () => true,
    //   onPanResponderMove: (event, gesture) => {
    //     console.log(gesture.dy);
    //   },
    //   onPanResponderRelease: (event, gesture) => {

    //   },
      // onPanResponderReject: (e, gestureState) => {
      //
      // },
      // onPanResponderGrant: (e, gestureState) => {
      //   console.log('grant')
      // },
      // onPanResponderStart: (e, gestureState) => {
      //   console.log('start')
      // },
      // onPanResponderEnd: (e, gestureState) => {
      //   console.log('end')
      // },
      // onPanResponderTerminate: (event, gesture) => {
      //  console.log('terminating panresponder');
      // },
      // onPanResponderTerminationRequest: (event, gesture) => {
        //console.log('terminationrequest')
        //this.resetPosition();
    //   }
    // });

    this.state = {
      restaurant: null,
      photos: [],
      comments: [],
      userBookmarked: false,
      yesCount: 0,
      noCount: 0,
      selectedPhoto: null,
      navLoading: true,
      distance: '',
      driving: false,
      walking: false,
      driveTime: '',
      walkTime: '',
      price: false,
      modalVisible: false,
      loading: true,
      showRecommend: false,
      showTime: false,
      ratingHeight: 0,
      infoHeight: 0,
      scrollY: new Animated.Value(0),
      headerScrollDistance: 0,
      userLiked: false,
      userDisliked: false,
      userHasVoted: false,
      listHeight: 0,
      editHeight: 0,
      commentHeight: 0,
      focusedTab: 0
    };
    this.timer = null;
    this.oldValue = null;
    this.timer2 = null;
    this.oldValue2 = null;
    this.allowCloseKeyboard = false;
  }

  componentWillMount() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.restaurant !== this.props.restaurant) {
      const r = nextProps.restaurant;
      this.photosHeight = Math.ceil(r.photos.length / 3) * PHOTO_HEIGHT + 5;
      this.commentsHeight = 0;
      this.currentPhotoScrollPosition = 0;
      this.currentCommentScrollPosition = 0;
      this.currentScrollY = new Animated.Value(0);
      this.setState({
        restaurant: r,
        photos: r.photos,
        comments: nextProps.comments,
        userBookmarked: r.user_bookmarked,
        yesCount: r.recommend_yes_count,
        noCount: r.recommend_no_count,
        userLiked: r.user_recommended_yes,
        userDisliked: r.user_recommended_no,
        userHasVoted: r.user_recommended_yes || r.user_recommended_no,
        loading: nextProps.loading,
        listHeight: this.photosHeight
      });
      this.getNavigation(nextProps.restaurant);
    }
  }

  setRatingHeight(event) {
    this.setState({
      ratingHeight: event.nativeEvent.layout.height
    });
  }

  setInfoHeight(event) {
    this.setState({
      infoHeight: event.nativeEvent.layout.height
    });
  }

  getNavigation(restaurant) {
    const formattedAddress = restaurant.location.display_address.map(address =>
      address.replace(/\s/g, '+')
    );
    if (this.props.browsingPrinceton) {
      this.sendNavigationRequest(formattedAddress, pcoords.lat, pcoords.lng);
    } else {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.sendNavigationRequest(formattedAddress, lat, lng);
      });
    }
  }

  getHours(hours) {
    const today = new Date();
    const dayNumber = (today.getDay() + 6) % 7;
    const currentTime = today.getHours() * 100 + today.getMinutes();
    const filteredHours = hours.open.filter(record => {
      let endTime = parseInt(record.end);
      if (record.is_overnight) {
        endTime += 2400;
      }
      return dayNumber === record.day && endTime > currentTime;
    }

    );
    if (filteredHours.length === 0) {
      return { start: 'closed' };
    }
    return {
      start: filteredHours[0].start,
      end: filteredHours[0].end,
      overnight: filteredHours[0].is_overnight
    };
  }

  sendNavigationRequest(address, lat, lng) {
    request.get(directionsRequest(lat, lng, address, 'walking'))
    .then(response => {
      request.get(directionsRequest(lat, lng, address, 'driving'))
      .then(response2 => {
        const walkDirections = response.data;
        const driveDirections = response2.data;
        const walkTime = walkDirections.routes[0].legs[0].duration.text.replace(/s$/, '');
        const driveTime = driveDirections.routes[0].legs[0].duration.text.replace(/s$/, '');
        const distance = walkDirections.routes[0].legs[0].distance.text;
        if (!walkTime.includes('hour') && parseInt(walkTime) <= 15) {
          this.setState({
            navLoading: false,
            driving: false,
            walking: true,
            walkTime,
            driveTime,
            distance
          });
        } else {
          this.setState({
            navLoading: false,
            driving: true,
            walking: false,
            walkTime,
            driveTime,
            distance
          });
        }
      })
      .catch(e => request.showErrorAlert(e));
    })
    .catch(e => request.showErrorAlert(e));
  }

  timeUntilCloseLabel(hoursArray) {
    if (!hoursArray) {
      return ({
        openClose: '--',
        untilTime: null
      });
    }

    const hours = hoursArray[0];
    const trueHours = this.getHours(hours);
    if (!trueHours) return '';
    if (trueHours.start === 'closed') {
      return ({
        openClose: 'Closed',
        untilTime: 'For today'
      });
    }

    const openTime = trueHours.start;
    const closeTime = trueHours.end;

    if (!this.isOpen(hours)) {
      const time = this.timeString(openTime);
      return ({
        openClose: 'Closed',
        untilTime: `Until ${time}`
      });
    }
    const time = this.timeString(closeTime);
    return ({
      openClose: 'Open',
      untilTime: `Until ${time}`
    });
  }

  isOpen(hours) {
    return hours.is_open_now;
  }

  timeString(time) {
    const timeHours = Math.floor(time / 100);
    const timeMinutes = time - timeHours * 100;
    const timeDate = moment({ hours: timeHours, minutes: timeMinutes });
    if (timeMinutes === 0) {
      return timeDate.format('h A');
    }
    return timeDate.format('h:mm A');
  }

  changeRecommendDisplay() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ showRecommend: !this.state.showRecommend });
  }

  changeUserBookmarked() {
    if (this.oldValue == null) this.oldValue = this.state.userBookmarked;
    if (this.state.userBookmarked) {
      this.setState({ userBookmarked: false });
      const del = () => {
        const temp = this.oldValue;
        this.timer = null;
        this.oldValue = null;
        if (temp === false) return;
        request.delete(restBookmarkRequest(this.state.restaurant.id))
        .catch(e => request.showErrorAlert(e));
      };
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(del, 1000);
    } else {
      this.setState({ userBookmarked: true });
      const post = () => {
        const temp = this.oldValue;
        this.timer = null;
        this.oldValue = null;
        if (temp === true) return;
        request.post(restBookmarkRequest(this.state.restaurant.id))
        .catch(e => request.showErrorAlert(e));
      };
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(post, 1000);
    }
  }

  sendUpdateRequest(type) {
    const patch = () => {
      const temp = this.oldValue2;
      this.timer2 = null;
      this.oldValue2 = null;
      if (temp === type) return;
      request.patch(restRecommendRequest(this.state.restaurant.id, type))
      .catch(e => request.showErrorAlert(e));
    };
    if (this.timer2) clearTimeout(this.timer2);
    this.timer2 = setTimeout(patch, 1000);
  }

  voteYes() {
    this.oldValue2 = 'clear';
    this.sendUpdateRequest('yes');
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({
      yesCount: this.state.yesCount + 1,
      userLiked: true,
      userDisliked: false,
      userHasVoted: true,
    });
  }

  clearYes() {
    this.oldValue2 = 'yes';
    this.sendUpdateRequest('clear');
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({
      yesCount: this.state.yesCount - 1,
      userLiked: false,
      userDisliked: false,
      userHasVoted: false,
    });
  }

  clearNoVoteYes() {
    this.oldValue2 = 'no';
    this.sendUpdateRequest('yes');
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({
      yesCount: this.state.yesCount + 1,
      noCount: this.state.noCount - 1,
      userLiked: true,
      userDisliked: false,
      userHasVoted: true,
    });
  }

  voteNo() {
    this.oldValue2 = 'clear';
    this.sendUpdateRequest('no');
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({
      noCount: this.state.noCount + 1,
      userLiked: false,
      userDisliked: true,
      userHasVoted: true,
    });
  }

  clearNo() {
    this.oldValue2 = 'no';
    this.sendUpdateRequest('clear');
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({
      noCount: this.state.noCount - 1,
      userLiked: false,
      userDisliked: false,
      userHasVoted: false,
    });
  }

  clearYesVoteNo() {
    this.oldValue2 = 'yes';
    this.sendUpdateRequest('no');
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({
      yesCount: this.state.yesCount - 1,
      noCount: this.state.noCount + 1,
      userLiked: false,
      userDisliked: true,
      userHasVoted: true,
    });
  }

  renderHeader(headerScrollDistance, pageY) {
    const restaurant = this.state.restaurant;
    const nameTranslateY = this.state.scrollY.interpolate({
      inputRange: [0, headerScrollDistance],
      outputRange: [0, headerScrollDistance / 3 * 0.5],
      extrapolate: 'clamp'
    });
    const opacity = this.state.scrollY.interpolate({
      inputRange: [0, headerScrollDistance * 0.6],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <Animated.View style={{ zIndex: 2, height: 175, transform: [{ translateY: pageY }] }}>
        <Banner
          photo={(this.state.photos.length > 0) ? this.state.photos[0].url : undefined}
          containerStyle={{ flex: 1 }} // height: 150
          photoStyle={{ flex: 1, backgroundColor: '#d3d3d3' }}
        >
          <LinearGradient
            start={{ x: 0.5, y: 0.1 }}
            end={{ x: 0.5, y: 1.0 }}
            colors={['transparent', 'rgba(0, 0, 0, 0.36)']}
            style={{ flex: 1 }}
          >
            <Animated.View
              style={[headerContainerStyle, { transform: [{ translateY: nameTranslateY }] }]}
            >
              <Animated.View style={[titleContainerStyle, { opacity }]}>
                <Text style={addressStyle}>
                  {`${restaurant.location.display_address[0]} | ${this.state.distance}`}
                </Text>
              </Animated.View>

              <View style={titleContainerStyle}>
                <Text style={titleStyle}>
                  {restaurant.name}
                </Text>
              </View>

              <Animated.View style={[filterContainerStyle, { opacity }]}>
                <FilterBar filters={this.state.restaurant.categories} />
              </Animated.View>
            </Animated.View>
          </LinearGradient>
        </Banner>
      </Animated.View>
    );
  }

  // Restaurant rating and bookmark
  renderRating() {
    let button = 'score_down';
    if (this.state.showRecommend) {
      button = 'score_up';
    }
    const voteCount = this.state.yesCount + this.state.noCount;
    let rating = '--';
    if (voteCount !== 0) {
      rating = `${Math.round(this.state.yesCount / voteCount * 100)}%`;
    }
    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={() => this.changeRecommendDisplay()}>
              <View style={ratingSectionStyle}>
                <View style={{ height: 20, width: 20, marginRight: 15 }} />
                <View style={ratingContainerStyle} /*onLayout={e => this.setRatingHeight(e)}*/>
                  <Text style={ratingPercentStyle}>
                    {rating}
                  </Text>
                  <Text style={ratingCountStyle}>
                    {`${voteCount} votes`}
                  </Text>
                </View>
                <Icon
                  name={button}
                  style={{ marginLeft: 15, height: 20, width: 20 }}
                  size={15}
                  color='rgba(0, 0, 0, 0.46)'
                  backgroundColor='white'
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          {this.renderBookmark()}
        </View>
        {this.renderRecommend()}
      </View>
    );
  }

  renderRecommend() {
    if (this.state.showRecommend) {
      if (!this.state.userHasVoted) {
        return (
          <View
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.04)', paddingHorizontal: 30, zIndex: 1 }}
          >
            <View style={recommendContainerStyle}>
              <Text style={recommendPromptStyle}>Do you recommend this restaurant?</Text>
              <TouchableOpacity onPress={this.voteYes.bind(this)}>
                <View style={voteBoxStyle}>
                  <Text style={recommendVoteStyle}>YES</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.voteNo.bind(this)}>
                <View style={voteBoxStyle}>
                  <Text style={recommendVoteStyle}>NO</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
      return (
        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.04)', paddingRight: 30, zIndex: 1 }}>
          <View style={recommendContainerStyle}>
            {this.renderYesNo()}
            <Text style={[recommendPromptStyle, { marginLeft: 15 }]}>Thanks for voting!</Text>
          </View>
        </View>
      );
    }
  }

  renderYesNo() {
    const yesBoxStyle = { backgroundColor: 'rgba(79, 217, 41, 0.76)', ...hasVotedBoxStyle };
    const noBoxStyle = { backgroundColor: 'rgba(255, 112, 112, 1)', ...hasVotedBoxStyle };

    if (this.state.userLiked) {
      return (
        <TouchableOpacity onPress={this.clearYes.bind(this)}>
          <View style={yesBoxStyle}>
            <Text style={recommendVoteStyle}>YES</Text>
          </View>
        </TouchableOpacity>
      );
    }
    if (this.state.userDisliked) {
      return (
        <TouchableOpacity onPress={this.clearNo.bind(this)}>
          <View style={noBoxStyle}>
            <Text style={recommendVoteStyle}>NO</Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  renderBookmark() {
    let bookmarkColor = 'rgba(0, 0, 0, 0.16)';
    if (this.state.userBookmarked) {
      bookmarkColor = '#ff9700';
    }
    return (
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <View style={{ paddingRight: 40, backgroundColor: 'transparent' }}>
          <TouchableOpacity
            style={{ height: 45, width: 20, backgroundColor: 'transparent' }}
            onPress={this.changeUserBookmarked.bind(this)}
          >
            <Icon
              name='bookmark'
              size={43}
              color={bookmarkColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderTime() {
    const timeInfo = this.timeUntilCloseLabel(this.state.restaurant.hours);
    if (timeInfo.openClose === '--') {
      return (
        <View style={infoObjectStyle}>
          <MaterialIcon
            name='access-time'
            size={31}
            style={{ height: 30 }}
            color={'rgba(0,0,0,0.63)'}
          />
          <Text style={infoIconStyle}>
            {timeInfo.openClose}
          </Text>
        </View>
      );
    } else if (this.state.showTime) {
      return (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={{ marginHorizontal: 7 }}
            onPress={() => this.setState({ showTime: false })}
          >
            <View style={infoObjectStyle}>
              <MaterialIcon
                name='access-time'
                size={31}
                style={{ height: 30 }}
                color={'rgba(0,0,0,0.63)'}
              />
              <Text style={infoIconStyle}>
                {timeInfo.untilTime}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          activeOpacity={0.75}
          style={{ marginHorizontal: 7 }}
          onPress={() => this.setState({ showTime: true })}
        >
          <View style={infoObjectStyle}>
            <MaterialIcon
              name='access-time'
              size={31}
              style={{ height: 30 }}
              color={'rgba(0,0,0,0.63)'}
            />
            <Text style={infoIconStyle}>
              {timeInfo.openClose}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  // Navigation section of the horizontal info bar
  renderNav() {
    if (this.state.walking) {
      return (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={{ marginHorizontal: 7, flex: 1 }}
            onPress={() => this.setState({ walking: false, driving: true })}
          >
            <View style={infoObjectStyle}>
              <Icon
                name='walk'
                size={27}
                style={{ paddingTop: 3, paddingLeft: 7, height: 30 }}
                color={'rgba(0,0,0,0.63)'}
              />
              <Text style={infoIconStyle}>
                {this.state.walkTime}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else if (this.state.driving) {
      return (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={{ marginHorizontal: 7, flex: 1 }}
            onPress={() => this.setState({ walking: true, driving: false })}
          >
            <View style={infoObjectStyle}>
              <MaterialCommunityIcon
                name='car'
                size={30}
                style={{ height: 30 }}
                color={'rgba(0,0,0,0.63)'}
              />
              <Text style={infoIconStyle}>
                {this.state.driveTime}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  }

  // Price section of the horizontal info bar
  renderPrice() {
    if (this.state.restaurant.price == null) {
      return (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={{ marginHorizontal: 7, flex: 1 }}
            onPress={() => this.setState({ price: !this.state.price })}
          >
            <View style={infoObjectStyle}>
              <DollarSign />
              {this.renderPriceText()}
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    if (this.state.restaurant.price.length === 1) {
      return (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={{ marginHorizontal: 7, flex: 1 }}
            onPress={() => this.setState({ price: !this.state.price })}
          >
            <View style={infoObjectStyle}>
              <DollarSign />
              {this.renderPriceText()}
            </View>
          </TouchableOpacity>
        </View>
      );
    } else if (this.state.restaurant.price.length === 2) {
      return (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={{ marginHorizontal: 7, flex: 1 }}
            onPress={() => this.setState({ price: !this.state.price })}
          >
            <View style={infoObjectStyle}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <DollarSign />
                <DollarSign />
              </View>
              {this.renderPriceText()}
            </View>
          </TouchableOpacity>
        </View>
      );
    } else if (this.state.restaurant.price.length === 3) {
      return (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={{ marginHorizontal: 7, flex: 1 }}
            onPress={() => this.setState({ price: !this.state.price })}
          >
            <View style={infoObjectStyle}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <DollarSign />
                <DollarSign />
                <DollarSign />
              </View>
              {this.renderPriceText()}
            </View>
          </TouchableOpacity>
        </View>
      );
    } else if (this.state.restaurant.price.length === 4) {
      return (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={{ marginHorizontal: 7, flex: 1 }}
            onPress={() => this.setState({ price: !this.state.price })}
          >
            <View style={infoObjectStyle}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <DollarSign />
                <DollarSign />
                <DollarSign />
                <DollarSign />
              </View>
              {this.renderPriceText()}
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  }

  renderPriceText() {
    if (this.state.restaurant.price == null) {
      return (
        <Text style={infoIconStyle}>--</Text>
      );
    } else if (!this.state.price) {
      if (this.state.restaurant.price.length === 1) {
        return <Text style={infoIconStyle}>Cheap</Text>;
      } else if (this.state.restaurant.price.length === 2) {
        return <Text style={infoIconStyle}>Moderate</Text>;
      } else if (this.state.restaurant.price.length === 3) {
        return <Text style={infoIconStyle}>Expensive</Text>;
      } else if (this.state.restaurant.price.length === 4) {
        return <Text style={infoIconStyle}>Very Expensive</Text>;
      }
    }
    if (this.state.restaurant.price.length === 1) {
      return <Text style={infoIconStyle}>Under $10</Text>;
    } else if (this.state.restaurant.price.length === 2) {
      return <Text style={infoIconStyle}>$11 to $30</Text>;
    } else if (this.state.restaurant.price.length === 3) {
      return <Text style={infoIconStyle}>$31 to $60</Text>;
    } else if (this.state.restaurant.price.length === 4) {
      return <Text style={infoIconStyle}>Over $61</Text>;
    }
  }

  // Horizontal info bar containing restaurant hours, distance away, and price
  renderInfo() {
    return (
      <View style={{ backgroundColor: 'white', zIndex: 2 }}>
        <View
          style={{ borderTopWidth: this.state.showRecommend ? 0 : 1, ...infoContainerStyle }}
          //onLayout={e => this.setInfoHeight(e)}
        >
          {this.renderTime()}

          {this.renderNav()}

          {this.renderPrice()}
        </View>
      </View>
    );
  }

  renderTabBar(tabY, headerScrollDistance) {
    let photoNumColor = '#ff9700';
    let commentNumColor = 'rgba(0, 0, 0, 0.23)';
    let photoTextColor = 'rgba(0, 0, 0, 0.77)';
    let commentTextColor = 'rgba(0, 0, 0, 0.23)';
    if (this.state.focusedTab === 1) {
      commentNumColor = '#ff9700';
      photoNumColor = 'rgba(0, 0, 0, 0.23)';
      commentTextColor = 'rgba(0, 0, 0, 0.77)';
      photoTextColor = 'rgba(0, 0, 0, 0.23)';
    }
    const photoLabel = (this.state.photos.length === 1) ? ' PHOTO' : ' PHOTOS';
    const commentLabel = (this.state.comments.length === 1) ? ' REVIEW' : ' REVIEWS';
    const currentScrollY = new Animated.Value(0);
    this.state.scrollY.addListener(e => currentScrollY.setValue(e.value));
    return (
      <Animated.View style={[tabBarContainerStyle, { transform: [{ translateY: tabY }] }]}>
        <View style={tabBarStyle}>
          <TouchableOpacity
            onPress={() => {
              if (this.state.focusedTab !== 0) {
                this.currentCommentScrollPosition = currentScrollY._value;
                if (currentScrollY._value >= headerScrollDistance && this.currentPhotoScrollPosition < headerScrollDistance) {
                  this.scrollView._component.scrollTo({
                    x: 0,
                    y: headerScrollDistance,
                    animated: false
                  });
                } else if (currentScrollY._value < headerScrollDistance) {
                  // do nothing
                } else {
                  this.scrollView._component.scrollTo({
                    x: 0,
                    y: this.currentPhotoScrollPosition,
                    animated: false
                  });
                }
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                this.navigator.dispatch({ type: 'Navigation/NAVIGATE', routeName: 'Photos' });
                this.setState({ focusedTab: 0, listHeight: this.photosHeight });
              } else {
                if (currentScrollY._value > headerScrollDistance) {
                  this.scrollView._component.scrollTo({
                    x: 0,
                    y: headerScrollDistance,
                    animated: true
                  });
                }
              }
            }}
          >
            <View style={tabStyle}>
              <Text style={{ textAlign: 'center' }}>
                <Text style={{ color: photoNumColor, ...tabLabelStyle }}>
                  {this.state.photos.length}
                </Text>
                <Text style={{ color: photoTextColor, ...tabLabelStyle }}>{photoLabel}</Text>
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (this.state.focusedTab !== 1) {
                this.currentPhotoScrollPosition = currentScrollY._value;
                if (currentScrollY._value >= headerScrollDistance && this.currentCommentScrollPosition < headerScrollDistance) {
                  this.scrollView._component.scrollTo({
                    x: 0,
                    y: headerScrollDistance,
                    animated: false
                  });
                } else if (currentScrollY._value < headerScrollDistance) {
                  // do nothing
                } else {
                  this.scrollView._component.scrollTo({
                    x: 0,
                    y: this.currentCommentScrollPosition,
                    animated: false
                  });
                }
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                this.navigator.dispatch({ type: 'Navigation/NAVIGATE', routeName: 'Comments' });
                this.setState({ focusedTab: 1, listHeight: this.commentsHeight });
              } else {
                if (currentScrollY._value > headerScrollDistance) {
                  this.scrollView._component.scrollTo({
                    x: 0,
                    y: headerScrollDistance,
                    animated: true
                  });
                }
              }
            }}
          >
            <View style={tabStyle}>
              <Text style={{ textAlign: 'center' }}>
                <Text style={{ color: commentNumColor, ...tabLabelStyle }}>
                  {this.state.comments.length}
                </Text>
                <Text style={{ color: commentTextColor, ...tabLabelStyle }}>{commentLabel}</Text>
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {this.renderIndicator()}
      </Animated.View>
    );
  }

  renderIndicator() {
    const SCREEN_WIDTH = Dimensions.get('window').width;
    if (this.state.focusedTab === 0) {
      return (
        <View style={indicatorContainerStyle}>
          <View style={[indicatorStyle, { marginLeft: SCREEN_WIDTH / 2 - 120 }]} />
        </View>
      );
    }
    return (
      <View style={indicatorContainerStyle}>
        <View style={[indicatorStyle, { marginLeft: SCREEN_WIDTH / 2 }]} />
      </View>
    );
  }

  renderFooter() {
    const restaurant = this.state.restaurant;
    return (
      <View style={footerStyle}>
        <View style={[bottomSpacerStyle, { borderRightWidth: 1 }]}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => phonecall(restaurant.phone.substring(1), false)}
          >
            <View style={footerButtonStyle}>
              <Ionicon
                name='ios-call'
                borderRadius={0}
                color='gray'
                backgroundColor='white'
                size={20}
                style={{ marginRight: 5 }}
              />
              <Text style={footerTextStyle}>CALL</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={bottomSpacerStyle}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              const formattedAddress = this.state.restaurant.location.display_address.map(address =>
               address.replace(/\s/g, '+')
              );
              Linking.openURL(directionsURL(formattedAddress))
                .catch(e => request.showErrorAlert(e));
            }}
          >
            <View style={footerButtonStyle}>
              <Icon
                name='directions'
                borderRadius={0}
                color='gray'
                size={12}
                style={{ marginRight: 5 }}
                backgroundColor='white'
              />
              <Text style={footerTextStyle}>DIRECTIONS</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    if (this.state.loading || this.state.navLoading) {
      return <LoadingRestaurants />;
    }
    let height = 440;
    let headerScrollDistance = 158; //this.state.ratingHeight + this.state.infoHeight;
    const newHeight = height + headerScrollDistance / 3;
    if (this.state.showRecommend) {
      height += 50;
      headerScrollDistance += 50;
    }
    const pageY = this.state.scrollY.interpolate({
      inputRange: [0, headerScrollDistance],
      outputRange: [0, -headerScrollDistance / 3],
      extrapolate: 'clamp',
    });
    const tabY = this.state.scrollY.interpolate({
      inputRange: [headerScrollDistance, 2 * headerScrollDistance],
      outputRange: [0, headerScrollDistance],
      extrapolateLeft: 'clamp',
    });
    const opacity = this.state.scrollY.interpolate({
      inputRange: [0, headerScrollDistance],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <View style={pageStyle}>
        <StatusBar barStyle='light-content' />
        <View style={backContainerStyle}>
          <TouchableOpacity
            style={backButtonStyle}
            onPress={() => this.props.close()}
          >
            <Ionicon
              name='ios-arrow-back'
              backgroundColor='transparent'
              underlayColor='transparent'
              activeOpacity={0}
              color='white'
              size={30}
            />
          </TouchableOpacity>
        </View>
        {this.renderHeader(headerScrollDistance, pageY)}

        <Animated.View
          style={{ height: newHeight, marginBottom: 55, transform: [{ translateY: pageY }] }}
        >
          <Animated.ScrollView
            ref={scroll => { this.scrollView = scroll; }}
            scrollEventThrottle={1}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
            bounces={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
              { useNativeDriver: true },
            )}
            onTouchMove={() => {
              if (this.allowCloseKeyboard) {
                Keyboard.dismiss();
                this.allowCloseKeyboard = false;
              }
            }}
          >
            <Animated.View style={{ opacity }}>
              {this.renderRating()}

              {this.renderInfo()}
            </Animated.View>

            {this.renderTabBar(tabY, headerScrollDistance)}

            <Animated.View style={{ height: Math.max(this.state.listHeight, newHeight - 45) }}>
              <RestaurantNavigator
                ref={nav => { this.navigator = nav; }}
                screenProps={{
                  restaurant: this.state.restaurant,
                  photos: this.state.photos,
                  comments: this.state.comments,
                  listHeight: this.state.listHeight,
                  focused: this.state.focusedTab,
                  userLiked: this.state.userLiked,
                  userDisliked: this.state.userDisliked,
                  userHasVoted: this.state.userHasVoted,
                  voteYes: this.voteYes.bind(this),
                  clearYes: this.clearYes.bind(this),
                  clearNoVoteYes: this.clearNoVoteYes.bind(this),
                  voteNo: this.voteNo.bind(this),
                  clearNo: this.clearNo.bind(this),
                  clearYesVoteNo: this.clearYesVoteNo.bind(this),
                  setCommentsHeight: cHeight => {
                    this.commentsHeight = cHeight;
                    this.setState({ listHeight: cHeight });
                  },
                  scrollToEdit: () => {
                    this.scrollView._component.scrollTo({
                      x: 0,
                      y: headerScrollDistance,
                      animated: true
                    });
                  },
                  rerenderComments: comments => this.setState({ comments }),
                  allowKeyboardToClose: () => { this.allowCloseKeyboard = true; }
                }}
              />
            </Animated.View>
          </Animated.ScrollView>
        </Animated.View>
        {this.renderFooter(pageY)}
      </View>
    );
  }
}

const RestaurantNavigator = TabNavigator({
  Photos: {
    screen: RestaurantPhotos
  },
  Comments: {
    screen: RestaurantComments,
  }
},
{
  swipeEnabled: false,
  animationEnabled: false,
});

const styles = {
  pageStyle: { // Entire restaurant page
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  backContainerStyle: { // Header including back button, name, time until close, call button
    flexDirection: 'row',
    marginHorizontal: 5,
    marginTop: Platform.OS === 'ios' ? 15 : 5,
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 8
  },
  headerContainerStyle: {
    flex: 1,
    justifyContent: 'flex-end',
    marginRight: 35
  },
  backButtonStyle: { // Back button
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 10
  },
  titleContainerStyle: { // Contains a address and restaurant name
    paddingLeft: 35,
    alignItems: 'flex-start',
    marginLeft: 5,
    marginRight: 5,
  },
  addressStyle: {
    color: 'white',
    fontSize: 14,
    //fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  titleStyle: { // Restaurant name
    color: 'white',
    fontSize: 23,
    fontWeight: '900',
    textAlign: 'left',
    letterSpacing: 0.6,
    backgroundColor: 'transparent'
  },
  filterContainerStyle: {
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingLeft: 35
  },
  ratingSectionStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingContainerStyle: {
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 84.5,
    paddingVertical: 16,
  },
  ratingPercentStyle: {
    fontSize: 25,
    fontWeight: '900',
    color: 'rgba(0, 0, 0, 0.63)'
  },
  ratingCountStyle: {
    fontSize: 13,
    fontWeight: '300',
    color: 'rgba(0, 0, 0, 0.63)'
  },
  recommendContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50
  },
  voteBoxStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 7
  },
  hasVotedBoxStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 50,
  },
  recommendPromptStyle: {
    fontSize: 14,
    flex: 1,
    //textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.31)',
    marginLeft: 15
  },
  recommendVoteStyle: {
    fontSize: 12,
    fontWeight: '900',
    color: 'rgba(0, 0, 0, 0.31)',
  },
  infoContainerStyle: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginHorizontal: 30,
    borderBottomWidth: 1,
    height: 73.5,
    borderColor: 'rgba(0, 0, 0, 0.2)'
  },
  infoIconStyle: { // Time until close
    fontSize: 12,
    marginTop: 5,
    color: 'rgba(0, 0, 0, 0.63)',
    fontWeight: '400',
    textAlign: 'center'
  },
  infoObjectStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1
  },
  tabBarContainerStyle: {
    height: 45,
    zIndex: 8,
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 }
  },
  tabBarStyle: {
    backgroundColor: 'white',
    paddingHorizontal: Dimensions.get('window').width / 2 - 120,
    overflow: 'hidden',
    height: 40,
    elevation: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabStyle: {
    width: 120,
    flex: 1,
    marginTop: 5,
    justifyContent: 'center'
  },
  tabLabelStyle: {
    fontSize: 14,
    fontWeight: '900',
    paddingVertical: 5
  },
  indicatorContainerStyle: {
    flex: 1,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)'
  },
  indicatorStyle: {
    height: 5,
    width: 120,
    backgroundColor: '#ff9700'
  },
  footerStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: 'gray',
    elevation: 20,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.17,
    shadowRadius: 5,
  },
  footerButtonStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerTextStyle: {
    fontWeight: '900',
    fontSize: 13,
    color: 'gray'
  },
  bottomSpacerStyle: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
};

const {
  pageStyle,
  backContainerStyle,
  headerContainerStyle,
  backButtonStyle,
  titleContainerStyle,
  addressStyle,
  titleStyle,
  filterContainerStyle,
  ratingSectionStyle,
  ratingContainerStyle,
  ratingPercentStyle,
  ratingCountStyle,
  recommendContainerStyle,
  voteBoxStyle,
  hasVotedBoxStyle,
  recommendPromptStyle,
  recommendVoteStyle,
  infoContainerStyle,
  infoIconStyle,
  infoObjectStyle,
  tabBarContainerStyle,
  tabBarStyle,
  tabStyle,
  tabLabelStyle,
  indicatorContainerStyle,
  indicatorStyle,
  footerStyle,
  footerButtonStyle,
  footerTextStyle,
  bottomSpacerStyle,
} = styles;

function mapStateToProps({ browsingPrinceton }) {
  return { browsingPrinceton };
}

export default connect(mapStateToProps)(RestaurantDetail);
