/******************************************************************************
 * Called by: ./RestaurantModal
 * Dependencies: moment (date/time package), phonecall, helpers/axioshelper,
 * common/Button, common/ImageButton, common/FilterDisplay, ./CommentDetail
 *
 * Description: Base restaurant page that displays all the restaurant info.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import moment from 'moment';
import { TabNavigator, TabBarTop } from 'react-navigation';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { phonecall } from 'react-native-communications';
import getDirections from 'react-native-google-maps-directions';
import request from '../../helpers/axioshelper';
import { FilterDisplay } from '../common';
import RestaurantPhotos from './RestaurantPhotos';
import RestaurantComments from './RestaurantComments';

const restaurantDetails = 'https://fotafood.herokuapp.com/api/restaurant/';
const commentDetails = 'https://fotafood.herokuapp.com/api/comment/';

class RestaurantDetail extends Component {
  state = {
    photos: [],
    nouns: [],
    selectedPhoto: null,
    modalVisible: false,
    loading: true
  }

  componentWillMount() {
    request.get(restaurantDetails + this.props.restaurant.id)
    .then(response => {
      request.get(commentDetails + this.props.restaurant.id)
      .then(res2 => this.setState({
        photos: response.data,
        loading: false,
        nouns: res2.data
      })).catch(e => request.showErrorAlert(e));
    }).catch(e => request.showErrorAlert(e));
  }

  getTrueHours(hours) {
    const hourarray = JSON.parse(hours)[0].open;
    const now = new Date();
    const dayNow = (now.getDay() + 6) % 7;
    const hourNow = now.getHours() * 100;
    const candidateHours = hourarray.filter((element) => (element.day === dayNow));

    // Closed for today
    if (candidateHours.length === 0) {
      return {
        start: 'closed',
        end: 'closed'
      };
    }

    // Check the boundary case
    // Hasn't opened at all yet today
    if (parseInt(candidateHours[0].start) >= hourNow) {
      return {
        start: parseInt(candidateHours[0].start),
        end: parseInt(candidateHours[0].end)
      };
    }

    // Check the boundaray case
    // Closed for today -- use tomorrow's time
    if (parseInt(candidateHours[candidateHours.length - 1].end) <= hourNow) {
      const dayTomorrow = (dayNow + 1) % 7;
      const tomorrowHours = hourarray.filter((element) => (element.day === dayTomorrow));
      if (tomorrowHours.length === 0) {
        return {
          start: 'closed',
          end: 'closed'
        };
      }
      return {
        start: parseInt(tomorrowHours[0].start),
        end: parseInt(tomorrowHours[0].end)
      };
    }

    // Check if open now
    for (let i = 0; i < candidateHours.length; i++) {
      const start = parseInt(candidateHours[0].start);
      const end = parseInt(candidateHours[0].end);
      if (hourNow >= start && hourNow <= end) {
        return { start, end };
      }
    }

    // Check the next open time
    for (let i = 1; i < candidateHours.length; i++) {
      const prevClose = parseInt(candidateHours[i - 1].end);
      const nextOpen = parseInt(candidateHours[i].start);
      if (hourNow >= prevClose && hourNow <= nextOpen) {
        return { start: nextOpen, end: parseInt((candidateHours[i].end)) };
      }
    }

    // If we made it here, the data input was invalid. Return null
    return null;
  }

  isOpen(closeTime, openTime) {
    const currentHour = (new Date()).getHours() * 100;
    if (currentHour >= closeTime) {
      return false;
    }

    if (currentHour < openTime) {
      return false;
    }

    return true;
  }

  timeString(time) {
    const timeHours = Math.floor(time / 100);
    const timeMinutes = time - timeHours * 100;
    const timeDate = moment({ hours: timeHours, minutes: timeMinutes });
    return timeDate.format('h:mm A');
  }

  timeUntilCloseLabel(hours) {
    if (!hours) return '';
    const trueHours = this.getTrueHours(hours);
    if (!trueHours) return '';
    if (trueHours.start === 'closed') {
      return 'Closed for today';
    }

    const openTime = trueHours.start;
    const closeTime = trueHours.end;

    if (!this.isOpen(closeTime, openTime)) {
      const time = this.timeString(openTime);
      return `Closed until ${time}`;
    }
    const time = this.timeString(closeTime);
    return `Open until ${time}`;
  }

  handleGetDirections() {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude; // position.coords.latitude
      const lng = position.coords.longitude; // position.coords.longitude
      const data = {
        source: {
          latitude: lat,
          longitude: lng
        },
        destination: {
          latitude: this.props.restaurant.lat,
          longitude: this.props.restaurant.lng
        },
        params: [
          {
            key: 'dirflg',
            value: 'w'
          }
        ]
      };

      getDirections(data);
    });
  }

  renderFilters() {
    return this.props.restaurant.type.map(filterName =>
      <FilterDisplay
        key={filterName}
        text={filterName}
      />
    );
  }

  render() {
    const restaurant = this.props.restaurant;
    return (
      <View style={pageStyle}>
        <View style={headerStyle}>
          <View style={{ flex: 0.13, marginTop: 10 }}>
            <Ionicon.Button
              name='ios-arrow-back'
              backgroundColor='white'
              color='black'
              size={30}
              onPress={() => this.props.close()}
            />
          </View>

          <View style={titleContainerStyle}>
            <Text style={titleStyle}>
              {restaurant.name}
            </Text>
          </View>

          <View style={{ flex: 0.13 }} />
        </View>

        <View style={filterContainerStyle}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
          >
            {this.renderFilters()}
          </ScrollView>
        </View>

        <View style={infoContainerStyle}>
          <View style={infoObjectStyle}>
            <MaterialIcon name='access-time' size={30} />
            <Text style={timeUntilCloseStyle}>
              {this.timeUntilCloseLabel(this.props.restaurant.hours)}
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

        <RestaurantNavigator
          screenProps={{
            restaurant: this.props.restaurant,
          }}
        />

        <View style={{ flexDirection: 'row' }}>
          <View style={bottomSpacerStyle} />
          <FoundationIcon.Button
            name='telephone'
            borderRadius={0}
            backgroundColor='#FF9700'
            onPress={() => phonecall(restaurant.phoneNumber.substring(1), false)}
          >
            CALL
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
            backgroundColor='#FF9700'
            onPress={() => phonecall(restaurant.phoneNumber.substring(1), false)}
          >
            DIRECTIONS
          </MaterialIcon.Button>
          <View style={bottomSpacerStyle} />
        </View>
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
    paddingTop: (Platform.OS === 'ios') ? 15 : 0,
    //paddingBottom: 10
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
  titleContainerStyle: { // Contains a restaurant name and time until close
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
    flex: 1
  },
  titleStyle: { // Restaurant name
    fontFamily: 'Avenir',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
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
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  infoContainerStyle: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)'
  },
  infoObjectStyle: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  bottomSpacerStyle: {
    flex: 1,
    backgroundColor: '#FF9700'
  },
  bottomLineStyle: {
    borderRightWidth: 1,
    borderColor: 'white',
    flex: 2,
    backgroundColor: '#FF9700'
  }
};

const {
  pageStyle,
  headerStyle,
  titleContainerStyle,
  titleStyle,
  timeUntilCloseStyle,
  filterContainerStyle,
  infoContainerStyle,
  infoObjectStyle,
  bottomSpacerStyle,
  bottomLineStyle
} = styles;

export default RestaurantDetail;
