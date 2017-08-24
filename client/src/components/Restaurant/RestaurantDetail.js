/******************************************************************************
 * Called by: ./RestaurantModal
 * Dependencies: moment (date/time package), phonecall, helpers/axioshelper,
 * common/Button, common/ImageButton, common/FilterDisplay, ./CommentDetail
 *
 * Description: Base restaurant page that displays all the restaurant info.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { View, Text, ScrollView, Animated, Linking } from 'react-native';
import moment from 'moment';
import { TabNavigator, TabBarTop } from 'react-navigation';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { phonecall } from 'react-native-communications';
import Spinner from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient';
import { FilterDisplay, Banner } from '../common';
import request from '../../helpers/axioshelper';
import { directionsRequest, directionsURL } from '../../helpers/URL';
import RestaurantPhotos from './RestaurantPhotos';
import RestaurantComments from './RestaurantComments';

class RestaurantDetail extends Component {


  constructor(props) {
    super(props);

    this.state = {
      restaurant: null,
      photos: [],
      comments: [],
      selectedPhoto: null,
      navLoading: true,
      driving: false,
      walking: false,
      navTime: 0,
      modalVisible: false,
      loading: true,
      ratingHeight: 0,
      infoHeight: 0,
      scrollY: new Animated.Value(0)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.restaurant !== this.props.restaurant) {
      this.setState({
        restaurant: nextProps.restaurant,
        photos: nextProps.restaurant.photos,
        comments: nextProps.comments,
        loading: nextProps.loading
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
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const formattedAddress = restaurant.location.display_address.map(address =>
        address.replace(/\s/g, '+')
      );
      request.get(directionsRequest(lat, lng, formattedAddress, 'walking'))
        .then(response => {
          const walkDirections = response.data;
          const walkTime = walkDirections.routes[0].legs[0].duration.text;
          console.log(this.state.navLoading)
          if (!walkTime.includes('hour') && parseInt(walkTime) <= 15) {
            this.setState({ navLoading: false, driving: false, walking: true, navTime: walkTime });
          } else {
            request.get(directionsRequest(lat, lng, formattedAddress, 'driving'))
              .then(response2 => {
                const driveDirections = response2.data;
                const driveTime = driveDirections.routes[0].legs[0].duration.text;
                this.setState({ navLoading: false, driving: true, walking: false, navTime: driveTime });
              })
              .catch(e => { console.log(e); request.showErrorAlert(e); });
          }
        })
        .catch(e => { console.log(e); request.showErrorAlert(e); });
    });
  }

  getHours(hours) {
    const today = new Date();
    const dayNumber = (today.getDay() + 6) % 7;
    const hoursToday = hours.open[dayNumber];
    const start = hoursToday.start;
    const end = hoursToday.end;
    const overnight = hoursToday.is_overnight;
    return { start, end, overnight };
  }

  timeUntilCloseLabel(hours) {
    if (!hours) return '';
    const trueHours = this.getHours(hours);
    if (!trueHours) return '';
    if (trueHours.start === 'closed') {
      return 'Closed for today';
    }

    const openTime = trueHours.start;
    const closeTime = trueHours.end;

    if (!this.isOpen(hours)) {
      const time = this.timeString(openTime);
      return `Closed until ${time}`;
    }
    const time = this.timeString(closeTime);
    return `Open until ${time}`;
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

  checkScroll() {
    if (this.state.photos.length < 7) {
      return false;
    }
    return true;
  }

  renderFilters() {
    return this.state.restaurant.categories.map((filterName, index) =>
      <FilterDisplay
        key={index}
        text={filterName.title}
        color='white'
      />
    );
  }

  renderHeader(headerScrollDistance, pageY) {
    const restaurant = this.state.restaurant;
    const backTranslateY = this.state.scrollY.interpolate({
      inputRange: [0, headerScrollDistance],
      outputRange: [0, headerScrollDistance / 3],
      extrapolate: 'clamp'
    });
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
          photo={this.state.photos === undefined ? undefined : this.state.photos[0].url}
          containerStyle={{ flex: 1 }} // height: 150
          photoStyle={{ flex: 1 }}
        >
          <LinearGradient
            start={{ x: 0.5, y: 0.1 }}
            end={{ x: 0.5, y: 1.0 }}
            colors={['transparent', 'rgba(0, 0, 0, 0.36)']}
            style={{ flex: 1 }}
          >
            <Animated.View style={[headerStyle, { transform: [{ translateY: backTranslateY }] }]}>
              <View style={{ marginTop: 10 }}>
                <Ionicon.Button
                  name='ios-arrow-back'
                  backgroundColor='transparent'
                  underlayColor='transparent'
                  color='white'
                  size={30}
                  onPress={() => this.props.close()}
                />
              </View>
            </Animated.View>

            <Animated.View style={{ flex: 1, justifyContent: 'flex-end', marginRight: 35, transform: [{ translateY: nameTranslateY }] }}>
              <Animated.View style={[titleContainerStyle, { opacity }]}>
                <Text style={addressStyle}>
                  {restaurant.location.display_address[0]}
                </Text>
              </Animated.View>

              <View style={titleContainerStyle}>
                <Text style={titleStyle}>
                  {restaurant.name}
                </Text>
              </View>

              <Animated.View style={[filterContainerStyle, { opacity }]}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  bounces={false}
                >
                  {this.renderFilters()}
                </ScrollView>
              </Animated.View>
            </Animated.View>
          </LinearGradient>
        </Banner>
      </Animated.View>
    );
  }

  // Restaurant rating
  renderRating() {
    return (
      <View style={ratingContainerStyle} onLayout={e => this.setRatingHeight(e)}>
        <Text style={{ fontSize: 23, fontFamily: 'Avenir' }}>96%</Text>
        <Text style={{ fontSize: 12, fontFamily: 'Avenir' }}>103 votes</Text>
      </View>
    );
  }

  // Navigation section of the horizontal info bar
  renderNav() {
    if (this.state.walking) {
      //const timeString = `${this.state.navTime} min`
      return (
        <View style={infoObjectStyle}>
          <MaterialIcon name='directions-walk' size={31} color={'rgba(0,0,0,0.63)'} />
          <Text style={infoIconStyle}>
            {this.state.navTime}
          </Text>
        </View>
      );
    } else if (this.state.driving) {
      return (
        <View style={infoObjectStyle}>
          <MaterialCommunityIcon name='car' size={31} color={'rgba(0,0,0,0.63)'} />
          <Text style={infoIconStyle}>
            {this.state.navTime}
          </Text>
        </View>
      );
    }
  }

  // Price section of the horizontal info bar
  renderPrice() {
    if (this.state.restaurant.price.length === 1) {
      return (
        <View style={infoObjectStyle}>
          <FoundationIcon name='dollar' size={28} color={'rgba(0,0,0,0.63)'} />
          <Text style={infoIconStyle}>
            Cheap
          </Text>
        </View>
      );
    } else if (this.state.restaurant.price.length === 2) {
      return (
        <View style={infoObjectStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FoundationIcon name='dollar' size={28} color={'rgba(0,0,0,0.63)'} />
            <FoundationIcon name='dollar' size={28} color={'rgba(0,0,0,0.63)'} />
          </View>
          <Text style={infoIconStyle}>
            Moderate
          </Text>
        </View>
      );
    } else if (this.state.restaurant.price.length === 3) {
      return (
        <View style={infoObjectStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FoundationIcon name='dollar' size={28} color={'rgba(0,0,0,0.63)'} />
            <FoundationIcon name='dollar' size={28} color={'rgba(0,0,0,0.63)'} />
            <FoundationIcon name='dollar' size={28} color={'rgba(0,0,0,0.63)'} />
          </View>
          <Text style={infoIconStyle}>
            Expensive
          </Text>
        </View>
      );
    } else if (this.state.restaurant.price.length === 4) {
      return (
        <View style={infoObjectStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FoundationIcon name='dollar' size={28} color={'rgba(0,0,0,0.63)'} />
            <FoundationIcon name='dollar' size={28} color={'rgba(0,0,0,0.63)'} />
            <FoundationIcon name='dollar' size={28} color={'rgba(0,0,0,0.63)'} />
            <FoundationIcon name='dollar' size={28} color={'rgba(0,0,0,0.63)'} />
          </View>
          <Text style={infoIconStyle}>
            Very Expensive
          </Text>
        </View>
      );
    } else if (this.state.restaurant.price.length === 5) {
      return (
        <View style={infoObjectStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FoundationIcon name='dollar' size={28} color={'rgba(0,0,0,0.63)'} />
            <FoundationIcon name='dollar' size={28} color={'rgba(0,0,0,0.63)'} />
            <FoundationIcon name='dollar' size={28} color={'rgba(0,0,0,0.63)'} />
            <FoundationIcon name='dollar' size={28} color={'rgba(0,0,0,0.63)'} />
            <FoundationIcon name='dollar' size={28} color={'rgba(0,0,0,0.63)'} />
          </View>
          <Text style={infoIconStyle}>
            Take My Wallet
          </Text>
        </View>
      );
    }
  }

  // Horizontal info bar containing restaurant hours, distance away, and price
  renderInfo() {
    return (
      <View style={infoContainerStyle} onLayout={e => this.setInfoHeight(e)}>
        <View style={infoObjectStyle}>
          <MaterialIcon name='access-time' size={31} color={'rgba(0,0,0,0.63)'} />
          <Text style={infoIconStyle}>
            {this.timeUntilCloseLabel(this.state.restaurant.hours[0])}
          </Text>
        </View>

        {this.renderNav()}

        {this.renderPrice()}
      </View>
    );
  }

  renderFooter(pageY) {
    const restaurant = this.state.restaurant;
    return (
      <Animated.View style={[footerStyle, { transform: [{ translateY: pageY }] }]}>
        <View style={bottomSpacerStyle} />
        <FoundationIcon.Button
          name='telephone'
          borderRadius={0}
          color='gray'
          backgroundColor='white'
          onPress={() => phonecall(restaurant.phone.substring(1), false)}
        >
          <Text style={footerTextStyle}>CALL</Text>
        </FoundationIcon.Button>
        <View style={{ flexDirection: 'column', ...bottomSpacerStyle }}>
          <View style={bottomSpacerStyle} />
          <View style={bottomLineStyle} />
          <View style={bottomSpacerStyle} />
        </View>

        <View style={bottomSpacerStyle} />
        <MaterialIcon.Button
          name='directions'
          borderRadius={0}
          color='gray'
          backgroundColor='white'
          onPress={() => {
            navigator.geolocation.getCurrentPosition(position => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              const formattedAddress = this.state.restaurant.location.display_address.map(address =>
                address.replace(/\s/g, '+')
              );
              //formattedAddress = formattedAddress.reduce((total, line) => `${total}+${line}`);
              console.log(formattedAddress);
              Linking.openURL(directionsURL(lat, lng, formattedAddress))
                .catch(e => request.showErrorAlert(e));
            });
          }}
        >
          <Text style={footerTextStyle}>DIRECTIONS</Text>
        </MaterialIcon.Button>
        <View style={bottomSpacerStyle} />
      </Animated.View>
    );
  }

  render() {
    if (this.state.loading || this.state.navLoading) {
      return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <Spinner visible overlayColor='transparent' color='#ff9700' />
        </View>
      );
    }
    const height = 440;
    const headerScrollDistance = this.state.ratingHeight + this.state.infoHeight;
    const pageY = this.state.scrollY.interpolate({
      inputRange: [0, headerScrollDistance],
      outputRange: [0, -headerScrollDistance / 3],
      extrapolate: 'clamp',
    });
    const pageHeight = this.state.scrollY.interpolate({
      inputRange: [0, headerScrollDistance],
      outputRange: [height, height + headerScrollDistance / 3],
      extrapolate: 'clamp',
    });
    const tabY = this.state.scrollY.interpolate({
      inputRange: [headerScrollDistance, 2 * headerScrollDistance],
      outputRange: [0, headerScrollDistance],
      extrapolateLeft: 'clamp'
      //extrapolate: 'clamp',
    });
    const opacity = this.state.scrollY.interpolate({
      inputRange: [0, headerScrollDistance],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <View style={pageStyle}>
        {this.renderHeader(headerScrollDistance, pageY)}

        <Animated.View style={{ height: pageHeight, transform: [{ translateY: pageY }] }}>
          <ScrollView
            scrollEnabled={this.checkScroll()}
            scrollEventThrottle={1}
            overScrollMode='never'
            bounces={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
              //{ useNativeDriver: true },
            )}
          >
            <Animated.View style={{ opacity }}>
              {this.renderRating()}

              {this.renderInfo()}
            </Animated.View>

            <Animated.View style={{ height: pageHeight, transform: [{ translateY: tabY }] }}>
              <RestaurantNavigator
                screenProps={{
                  restaurant: this.state.restaurant,
                  photos: this.state.photos,
                  comments: this.state.comments
                }}
              />
            </Animated.View>
          </ScrollView>
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
  tabBarPosition: 'top',
  tabBarComponent: TabBarTop,
  swipeEnabled: true,
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: 'rgba(0, 0, 0, 0.77)',
    inactiveTintColor: 'rgba(0, 0, 0, 0.23)',
    labelStyle: {
      fontSize: 13,
      fontFamily: 'Avenir',
      fontWeight: '900'
    },
    indicatorStyle: {
      height: 5,
      backgroundColor: '#ff9700'
    },
    style: {
      backgroundColor: 'white',
      // shadowOffset: { width: 1, height: 5 },
      // shadowOpacity: 0.07,
      // shadowRadius: 3
    }
  }
});

const styles = {
  pageStyle: { // Entire restaurant page
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  headerStyle: { // Header including back button, name, time until close, call button
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    //marginBottom: 5
  },
  backButtonStyle: { // Back button
    width: 35,
    height: 35
  },
  titleContainerStyle: { // Contains a address and restaurant name
    paddingLeft: 35,
    alignItems: 'flex-start',
    marginLeft: 5,
    marginRight: 5,
    //marginBottom: 10
  },
  addressStyle: {
    color: 'white',
    fontFamily: 'Avenir',
    fontSize: 14,
    //fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  titleStyle: { // Restaurant name
    color: 'white',
    fontFamily: 'Avenir-Black',
    fontSize: 23,
    fontWeight: '900',
    textAlign: 'left',
    letterSpacing: 0.6,
    backgroundColor: 'transparent'
  },
  infoIconStyle: { // Time until close
    fontFamily: 'Avenir',
    fontSize: 12,
    marginTop: 5,
    color: 'rgba(0, 0, 0, 0.63)',
    fontWeight: '500',
    textAlign: 'center'
  },
  phoneButtonStyle: {
    width: 60,
    height: 60
  },
  filterContainerStyle: {
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingLeft: 30,
    marginLeft: 5,
    marginRight: 5,
  },
  ratingContainerStyle: {
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    //borderTopWidth: 1,
    //borderBottomWidth: 1,
    //marginHorizontal: 30,
    borderColor: 'rgba(0, 0, 0, 0.2)'
  },
  infoContainerStyle: {
    flexDirection: 'row',
  //  paddingHorizontal: 10,
    paddingVertical: 10,
    //justifyContent: 'space-around',
  //  borderWidth: 1,
    marginHorizontal: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)'
  },
  infoObjectStyle: {
    flexDirection: 'column',
    alignItems: 'center',
//    borderWidth: 1,
    flex: 1
  },
  footerStyle: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    flexDirection: 'row',
    paddingVertical: 10,
    borderColor: 'gray',
    elevation: 2,
    shadowOffset: { width: -1, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 3
  },
  footerTextStyle: {
    fontFamily: 'Avenir',
    fontWeight: '900',
    fontSize: 13,
    color: 'gray'
  },
  bottomSpacerStyle: {
    flex: 1,
    backgroundColor: 'white'
  },
  bottomLineStyle: {
    borderRightWidth: 1,
    borderColor: 'gray',
    flex: 2,
    backgroundColor: 'white'
  },
};

const {
  pageStyle,
  headerStyle,
  titleContainerStyle,
  addressStyle,
  titleStyle,
  infoIconStyle,
  filterContainerStyle,
  ratingContainerStyle,
  infoContainerStyle,
  infoObjectStyle,
  footerStyle,
  footerTextStyle,
  bottomSpacerStyle,
  bottomLineStyle
} = styles;

export default RestaurantDetail;
