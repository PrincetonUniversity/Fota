import React, { Component } from 'react';
import { View, Image, Text, ListView } from 'react-native';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import { phonecall } from 'react-native-communications';
import { ImageButton } from './common';

const styles = {
  modalStyle: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  pageStyle: { // Entire restaurant page
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 20,
  },
  headerStyle: { // Header including back button, name, time until close, call button
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 5,
    marginRight: 5
  },
  titleFont: { // Restaurant name
    fontFamily: 'Avenir',
    fontSize: 15,
    textAlign: 'justify'
  },
  timeUntilCloseFont: { // Time until close
    fontFamily: 'Avenir',
    fontSize: 10,
    textAlign: 'justify'
  },
  photoListStyle: { // List of photos (ListView)
    marginLeft: 15,
    marginRight: 15
  },
  photoStyle: { // Individual photos
    height: 120,
    width: 120,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 10
  },
  backButtonStyle: { // Back button
    width: 30,
    height: 30
  }
};

const { modalStyle,
        pageStyle,
        headerStyle,
        titleFont,
        timeUntilCloseFont,
        backButtonStyle,
        photoListStyle,
        photoStyle
      } = styles;

const restaurantDetails = 'https://fotafood.herokuapp.com/api/restaurant/';
const backButton = require('../img/fota_home_button_activated.png');

class RestaurantDetail extends Component {
  state = { photos: [], spinnerVisible: true }

  componentWillMount() {
    axios.get(restaurantDetails + this.props.restaurant.id)
      .then(response => this.setState({ photos: response.data,
                                        spinnerVisible: false }));
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

    console.log(timeOpenHours);
    return [timeOpenHours, timeOpenMinutes];
  }

  timeUntilCloseLabel(closeTime) {
    const timeUntilClose = this.timeUntilClose(closeTime);
    let hoursOpen = timeUntilClose[0]; // Hours in amount of time open.
    const minutesOpen = timeUntilClose[1]; // Minutes in amount of time open.
    let closingTimeString = 'Open for ';
    if (timeUntilClose[0] === 0) {
      closingTimeString += `${minutesOpen} minutes`;
    } else {
      if (minutesOpen > 30) {
        hoursOpen += 1;
      }
      closingTimeString += `${hoursOpen} hours`;
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
      <View style={modalStyle}>
        <View style={pageStyle}>
          <View>
            <View style={headerStyle}>
              <ImageButton
                style={backButtonStyle}
                source={backButton}
                onPress={() => this.props.close()}
              />
              <Text style={titleFont}>
                {restaurant.name}
              </Text>
              <Text style={timeUntilCloseFont}>
                {this.timeUntilCloseLabel(this.props.restaurant.closeTime)}
              </Text>
              <ImageButton
                style={backButtonStyle}
                source={backButton}
                onPress={() => phonecall(restaurant.phoneNumber)}
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
      </View>
    );
  }
}

export default RestaurantDetail;
