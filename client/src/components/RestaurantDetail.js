import React, { Component } from 'react';
import { View, Image, Text, ListView } from 'react-native';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import { phonecall } from 'react-native-communications';
import { ImageButton, FilterDisplay } from './common';

const styles = {
  modalStyle: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  pageStyle: { // Entire restaurant page
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', // #F8F8F8
    borderRadius: 20
  },
  headerStyle: { // Header including back button, name, time until close, call button
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5
  },
  backButtonStyle: { // Back button
    width: 30,
    height: 30
  },
  titleFont: { // Restaurant name
    fontFamily: 'Avenir',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'justify'
  },
  timeUntilCloseFont: { // Time until close
    fontFamily: 'Avenir',
    fontSize: 10,
    textAlign: 'justify'
  },
  phoneButtonStyle: {
    width: 30,
    height: 30
  },
  filterContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 5,
    marginRight: 5
  },
  photoListStyle: { // List of photos (ListView)
    marginLeft: 15,
    marginRight: 15,
  },
  photoStyle: { // Individual photos
    height: 150,
    width: 150,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 10
  }
};

const { pageStyle,
        headerStyle,
        backButtonStyle,
        titleFont,
        timeUntilCloseFont,
        phoneButtonStyle,
        filterContainerStyle,
        photoListStyle,
        photoStyle
      } = styles;

const restaurantDetails = 'https://fotafood.herokuapp.com/api/restaurant/';
const backButton = require('../img/fota_home_button_activated.png');
const phoneButton = require('../img/phone.png');

class RestaurantDetail extends Component {
  state = { photos: [], spinnerVisible: true }

  componentWillMount() {
    axios.get(restaurantDetails + this.props.restaurant.id)
      .then(response => this.setState({ photos: response.data,
                                        spinnerVisible: false }));
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

  renderPhoto(photo) {
    return (
      <View key={photo.id}>
        <Spinner visible={this.state.spinnerVisible} color='#ff9700' />
        <Image
          source={{ uri: photo.link }}
          style={photoStyle}
        />
      </View>
    );
  }

  render() {
    const restaurant = this.props.restaurant;
    const dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.id !== r2.id
        });
    return (
      <View style={pageStyle}>
        <View>
          <View style={headerStyle}>
            <ImageButton
              style={backButtonStyle}
              source={backButton}
              onPress={() => this.props.close()}
            />
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Text style={titleFont}>
                {restaurant.name}
              </Text>
              <Text style={timeUntilCloseFont}>
                {this.timeUntilCloseLabel(this.props.restaurant.closeTime,
                                          this.props.restaurant.openTime)}
              </Text>
            </View>
            <ImageButton
              style={phoneButtonStyle}
              source={phoneButton}
              onPress={() => phonecall(restaurant.phoneNumber)}
            />
          </View>

          <View style={filterContainerStyle}>
            <FilterDisplay
              text={this.props.restaurant.cuisine}
            />
          </View>

          <View style={photoListStyle}>
            <ListView
              dataSource={dataSource.cloneWithRows(this.state.photos)}
              renderRow={photo => this.renderPhoto(photo)}
              horizontal
              enableEmptySections
            />
          </View>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Text>
            Reviews
          </Text>
        </View>
      </View>
    );
  }
}

export default RestaurantDetail;
