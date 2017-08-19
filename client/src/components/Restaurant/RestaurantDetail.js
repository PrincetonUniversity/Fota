/******************************************************************************
 * Called by: ./RestaurantModal
 * Dependencies: moment (date/time package), phonecall, helpers/axioshelper,
 * common/Button, common/ImageButton, common/FilterDisplay, ./CommentDetail
 *
 * Description: Base restaurant page that displays all the restaurant info.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { View, Text, ScrollView, Platform, Animated } from 'react-native';
import moment from 'moment';
import { TabNavigator, TabBarTop } from 'react-navigation';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { phonecall } from 'react-native-communications';
import getDirections from 'react-native-google-maps-directions';
import Spinner from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient';
import request from '../../helpers/axioshelper';
import { restRequest } from '../../helpers/URL';
import { FilterDisplay, Banner } from '../common';
import RestaurantPhotos from './RestaurantPhotos';
import RestaurantComments from './RestaurantComments';

class RestaurantDetail extends Component {


  constructor(props) {
    super(props);

    this.state = {
      restaurant: null,
      photos: undefined,
      selectedPhoto: null,
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
        loading: nextProps.loadingRestaurant
      });
    }
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

  timeString(time) {
    const timeHours = Math.floor(time / 100);
    const timeMinutes = time - timeHours * 100;
    const timeDate = moment({ hours: timeHours, minutes: timeMinutes });
    return timeDate.format('h:mm A');
  }

  isOpen(hours) {
    return hours.is_open_now;
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

  // handleGetDirections() {
  //   navigator.geolocation.getCurrentPosition(position => {
  //     const lat = position.coords.latitude; // position.coords.latitude
  //     const lng = position.coords.longitude; // position.coords.longitude
  //     const data = {
  //       source: {
  //         latitude: lat,
  //         longitude: lng
  //       },
  //       destination: {
  //         latitude: this.props.restaurant.lat,
  //         longitude: this.props.restaurant.lng
  //       },
  //       params: [
  //         {
  //           key: 'dirflg',
  //           value: 'w'
  //         }
  //       ]
  //     };
  //
  //     getDirections(data);
  //   });
  // }

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

  checkScroll(distance) {
    if (this.state.scrollY > distance) {
      return false;
    }
    return true;
  }

  renderFilters() {
    return this.state.restaurant.categories.map((filterName, index) =>
      <FilterDisplay
        key={index}
        text={filterName.title}
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
      <Animated.View style={{ zIndex: 2, height: 150, transform: [{ translateY: pageY }] }}>
        <Banner
          photo={this.state.photos === undefined ? undefined : this.state.photos[2].url}
          containerStyle={{ flex: 1 }} // height: 150
          photoStyle={{ flex: 1 }}
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

          <Animated.View style={{ flex: 1, justifyContent: 'flex-end', transform: [{ translateY: nameTranslateY }] }}>
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
        </Banner>
      </Animated.View>
    );
  }

  renderRating() {
    return (
      <View style={ratingContainerStyle} onLayout={e => this.setRatingHeight(e)}>
        <Text style={{ fontSize: 23, fontFamily: 'Avenir' }}>96%</Text>
        <Text style={{ fontSize: 12, fontFamily: 'Avenir' }}>103 votes</Text>
      </View>
    );
  }

  renderInfo() {
    return (
      <View style={infoContainerStyle} onLayout={e => this.setInfoHeight(e)}>
        <View style={infoObjectStyle}>
          <MaterialIcon name='access-time' size={30} />
          <Text style={timeUntilCloseStyle}>
            {this.timeUntilCloseLabel(this.state.restaurant.hours[0])}
          </Text>
        </View>

        <View style={infoObjectStyle}>
          <MaterialIcon name='directions-walk' size={30} />
          <Text style={timeUntilCloseStyle}>
            5 min walk
          </Text>
        </View>

        <View style={infoObjectStyle}>
          <FoundationIcon name='dollar' size={30} />
          <Text style={timeUntilCloseStyle}>
            $11 - $30
          </Text>
        </View>
      </View>
    );
  }

  renderFooter(headerScrollDistance) {
    const restaurant = this.state.restaurant;
    const pageY = this.state.scrollY.interpolate({
      inputRange: [0, headerScrollDistance],
      outputRange: [0, -headerScrollDistance / 3],
      extrapolate: 'clamp',
    });
    return (
      <Animated.View style={{ flexDirection: 'row', borderColor: 'gray', transform: [{ translateY: pageY }] }}>
        <View style={bottomSpacerStyle} />
        <FoundationIcon.Button
          name='telephone'
          borderRadius={0}
          color='gray'
          backgroundColor='white'
          onPress={() => phonecall(restaurant.phone.substring(1), false)}
        >
          <Text style={{ color: 'gray' }}>CALL</Text>
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
          onPress={() => phonecall(restaurant.phone.substring(1), false)}
        >
          <Text style={{ color: 'gray' }}>DIRECTIONS</Text>
        </MaterialIcon.Button>
        <View style={bottomSpacerStyle} />
      </Animated.View>
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <View>
          <Spinner visible color='#ff9700' />
        </View>
      );
    }

    const height = 480;
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
      extrapolate: 'clamp',
    });
    const opacity = this.state.scrollY.interpolate({
      inputRange: [0, headerScrollDistance],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    console.log(pageY);
    return (
      <View style={pageStyle}>
        {this.renderHeader(headerScrollDistance, pageY)}

        <Animated.View style={{ height: pageHeight, transform: [{ translateY: pageY }] }}>
          <ScrollView
            scrollEnabled={this.checkScroll(headerScrollDistance)}
            scrollEventThrottle={1}
            overScrollMode='never'
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
              //{ useNativeDriver: true },
            )}
          >
            <Animated.View style={{ opacity }}>
              {this.renderRating()}

              {this.renderInfo()}
            </Animated.View>

            <Animated.View style={{ transform: [{ translateY: tabY }] }}>
              <RestaurantNavigator
                screenProps={{
                  restaurant: this.state.restaurant,
                  photos: this.state.photos,
                }}
              />
            </Animated.View>
          </ScrollView>
        </Animated.View>

        {this.renderFooter(headerScrollDistance)}
      </View>
    );
  }
}

const RestaurantNavigator = TabNavigator({
  Photos: {
    screen: RestaurantPhotos
  },
  Comments: {
    screen: RestaurantComments
  }
},
{
  tabBarPosition: 'top',
  tabBarComponent: TabBarTop,
  tabBarOptions: {
    activeTintColor: '#FF9700',
    inactiveTintColor: '#CBCBCB',
    labelStyle: {
      fontSize: 13,
      color: 'black'
    },
    indicatorStyle: {
      height: 5,
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
    marginRight: 5
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
    fontFamily: 'Avenir',
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  timeUntilCloseStyle: { // Time until close
    fontFamily: 'Avenir',
    fontSize: 10,
    textAlign: 'justify'
  },
  phoneButtonStyle: {
    width: 60,
    height: 60
  },
  filterContainerStyle: {
    alignItems: 'flex-start',
    marginBottom: 5,
    paddingLeft: 30,
    marginLeft: 5,
    marginRight: 5,
  },
  ratingContainerStyle: {
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)'
  },
  infoContainerStyle: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-around',
    //borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)'
  },
  infoObjectStyle: {
    flexDirection: 'column',
    alignItems: 'center'
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
  }
};

const {
  pageStyle,
  headerStyle,
  titleContainerStyle,
  addressStyle,
  titleStyle,
  timeUntilCloseStyle,
  filterContainerStyle,
  ratingContainerStyle,
  infoContainerStyle,
  infoObjectStyle,
  bottomSpacerStyle,
  bottomLineStyle
} = styles;

export default RestaurantDetail;
