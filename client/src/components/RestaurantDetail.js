import React, { Component } from 'react';
import { View, Image, Text, ScrollView, FlatList } from 'react-native';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import { phonecall } from 'react-native-communications';
import { ImageButton, FilterDisplay } from './common';

const styles = {
  pageStyle: { // Entire restaurant page
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF' // #F8F8F8
  },
  headerStyle: { // Header including back button, name, time until close, call button
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  backButtonStyle: { // Back button
    width: 35,
    height: 35,
    marginRight: 25,
    marginBottom: 25
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
    marginRight: 5
  },
  // photoListStyle: { // List of photos (ListView)
  //
  // },
  photoStyle: { // Individual photos
    height: 150,
    width: 150,
    marginLeft: 2.5,
    marginRight: 2.5
  }
};

const { pageStyle,
        headerStyle,
        backButtonStyle,
        titleContainerStyle,
        titleStyle,
        timeUntilCloseStyle,
        phoneButtonStyle,
        filterContainerStyle,
        photoStyle
      } = styles;

const restaurantDetails = 'https://fotafood.herokuapp.com/api/restaurant/';
const commentDetails = 'https://fotafood.herokuapp.com/api/comment/';
const backButton = require('../img/exit_button.png');
const phoneButton = require('../img/phone.png');

class RestaurantDetail extends Component {
  state = { photos: [], comments: [], spinnerVisible: true, refreshing: false }

  componentWillMount() {
    axios.get(restaurantDetails + this.props.restaurant.id)
      .then(response => this.setState({ photos: response.data,
                                        spinnerVisible: false }));
    axios.get(commentDetails + this.props.restaurant.id)
      .then(response => this.setState({ comments: response.data }));
  }

  isOpen(closeTime, openTime) {
    const currentDate = moment(new Date());
    const openTimeHours = Math.floor(openTime / 100);
    const openTimeMinutes = openTime - openTimeHours * 100;
    const openDate = moment({ hours: openTimeHours, minutes: openTimeMinutes });
    const closeTimeHours = Math.floor(closeTime / 100);
    const closeTimeMinutes = closeTime - closeTimeHours * 100;
    const closeDate = moment({ hours: closeTimeHours, minutes: closeTimeMinutes });
    if (currentDate > closeDate) {
      closeDate.add(1, 'days');
    }
    if (currentDate > openDate && currentDate < closeDate) {
      return true;
    }
    return false;
  }

  timeUntilClose(closeTime) { // Calculates how long until the restaurant closes
    const currentDate = moment(new Date());
    const closeTimeHours = Math.floor(closeTime / 100);
    const closeTimeMinutes = closeTime - closeTimeHours * 100;
    const closeDate = moment({ hours: closeTimeHours, minutes: closeTimeMinutes });
    if (currentDate > closeDate) {
      closeDate.add(1, 'days');
    }
    const timeOpenHours = closeDate.diff(currentDate, 'hours');
    const timeOpenMinutes = closeDate.diff(currentDate, 'minutes') % 60;

    return [timeOpenHours, timeOpenMinutes];
  }

  timeUntilCloseLabel(closeTime, openTime) {
    if (!this.isOpen(closeTime, openTime)) {
      const openTimeHours = Math.floor(openTime / 100);
      const openTimeMinutes = openTime - openTimeHours * 100;
      const openDate = moment({ hours: openTimeHours, minutes: openTimeMinutes });
      const openTimeString = openDate.format('h:mm A');
      return `Closed until ${openTimeString}`;
    }
    const timeUntilClose = this.timeUntilClose(closeTime);
    let hoursOpen = timeUntilClose[0]; // Hours in amount of time open.
    const minutesOpen = timeUntilClose[1]; // Minutes in amount of time open.
    let closingTimeString = 'Open for ';
    if (timeUntilClose[0] === 0) {
      if (minutesOpen === 1) {
        closingTimeString += `${minutesOpen} minute`;
      } else {
        closingTimeString += `${minutesOpen} minutes`;
      }
    } else {
      if (minutesOpen > 30) {
        hoursOpen += 1;
      }
      if (hoursOpen === 1) {
        closingTimeString += `${hoursOpen} hour`;
      } else {
        closingTimeString += `${hoursOpen} hours`;
      }
    }
    return closingTimeString;
  }

  renderFilters() {
    return this.props.restaurant.type.map(filterName =>
      <FilterDisplay
        key={filterName}
        text={filterName}
      />
    );
  }

  renderPhoto(photo) {
    return (
      <View key={photo.item.id}>
        <Spinner visible={this.state.spinnerVisible} color='#ff9700' />
        <Image
          source={{ uri: photo.item.link }}
          style={photoStyle}
        />
      </View>
    );
  }

  renderComment(comment) {
    const adj = comment.item.adj.charAt(0).toUpperCase() + comment.item.adj.slice(1);
    const noun = comment.item.noun.charAt(0).toUpperCase() + comment.item.noun.slice(1);
    const commentString = `${adj} ${noun}`;
    return (
      <FilterDisplay
        key={commentString}
        text={commentString}
      />
    );
  }

  render() {
    const restaurant = this.props.restaurant;
    return (
      <View style={pageStyle}>
        <View>
          <View style={headerStyle}>
            <View style={{ marginTop: 5, marginLeft: 5 }}>
              <ImageButton
                style={backButtonStyle}
                source={backButton}
                onPress={() => this.props.close()}
              />
            </View>

            <View style={titleContainerStyle}>
              <Text style={titleStyle}>
                {restaurant.name}
              </Text>
              <Text style={timeUntilCloseStyle}>
                {this.timeUntilCloseLabel(this.props.restaurant.closeTime,
                                          this.props.restaurant.openTime)}
              </Text>
            </View>

            <View style={{ marginTop: 5, marginRight: 5 }}>
              <ImageButton
                style={phoneButtonStyle}
                source={phoneButton}
                onPress={() => phonecall(restaurant.phoneNumber)}
              />
            </View>
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

          <View style={{ marginBottom: 10 }}>
            <FlatList
              data={this.state.photos}
              keyExtractor={photo => photo.id}
              renderItem={photo => this.renderPhoto(photo)}
              showsHorizontalScrollIndicator={false}
              horizontal
            />
          </View>

          <Text style={titleStyle}>
            Consensus!
          </Text>
          <View style={{ alignItems: 'center' }}>
            <FlatList
              data={this.state.comments}
              keyExtractor={comment => comment.id}
              renderItem={comment => this.renderComment(comment)}
              bounces={false}
            />
          </View>
        </View>

      </View>
    );
  }
}

export default RestaurantDetail;
