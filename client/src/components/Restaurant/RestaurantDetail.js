import React, { Component } from 'react';
import { View, Image, Text, ScrollView, FlatList } from 'react-native';
import moment from 'moment';
import { phonecall } from 'react-native-communications';
import request from '../../helpers/axioshelper';
import { Button, ImageButton, FilterDisplay } from '../common';
import CommentDetail from './CommentDetail';

const styles = {
  pageStyle: { // Entire restaurant page
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginBottom: 10
  },
  headerStyle: { // Header including back button, name, time until close, call button
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
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
  emptyTextStyle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#aaa',
    fontFamily: 'Avenir',
  },
  emptyCommentTextStyle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#aaa',
    fontFamily: 'Avenir',
    backgroundColor: '#f00'
  },
  photoStyle: { // Individual photos
    height: 150,
    width: 150,
    marginLeft: 2.5,
    marginRight: 2.5
  },
};

const {
  pageStyle,
  headerStyle,
  backButtonStyle,
  titleContainerStyle,
  titleStyle,
  timeUntilCloseStyle,
  phoneButtonStyle,
  filterContainerStyle,
  emptyTextStyle,
  photoStyle,
} = styles;

const restaurantDetails = 'https://fotafood.herokuapp.com/api/restaurant/';
const commentDetails = 'https://fotafood.herokuapp.com/api/comment/';
const backButton = require('../../img/exit_button.png');
const phoneButton = require('../../img/phone.png');

class RestaurantDetail extends Component {
  state = { photos: [], nouns: [], loading: true }

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
    // const currentDate = moment(new Date());
    // const openTimeHours = Math.floor(openTime / 100);
    // const openTimeMinutes = openTime - openTimeHours * 100;
    // const openDate = moment({ hours: openTimeHours, minutes: openTimeMinutes });
    // const closeTimeHours = Math.floor(closeTime / 100);
    // const closeTimeMinutes = closeTime - closeTimeHours * 100;
    // const closeDate = moment({ hours: closeTimeHours, minutes: closeTimeMinutes });
    // if (currentDate > closeDate) {
    //   closeDate.add(1, 'days');
    // }
    // if (currentDate > openDate && currentDate < closeDate) {
    //   return true;
    // }
    // return false;
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

  renderCommentUpload() {
    this.props.navigator.push({ id: 1 });
  }

  renderFilters() {
    return this.props.restaurant.type.map(filterName =>
      <FilterDisplay
        key={filterName}
        text={filterName}
      />
    );
  }

  renderPhotoList() {
    if (!this.state.loading && this.state.photos.length === 0) {
      return (
        <View style={{ height: 150, justifyContent: 'center' }}>
          <Text style={emptyTextStyle}>
            Be the first to upload a photo here!
          </Text>
        </View>

      );
    }
    return (
      <FlatList
        data={this.state.photos}
        keyExtractor={photo => photo.id}
        renderItem={photo => this.renderPhoto(photo.item)}
        showsHorizontalScrollIndicator={false}
        horizontal
      />
    );
  }

  renderCommentList() {
    if (!this.state.loading && this.state.nouns.length === 0) {
      return (
        <View style={{ flex: 1, marginHorizontal: 20, marginTop: 5 }}>
          <Text style={emptyTextStyle}>
            There are no comments for this restaurant yet. Be the first to write one!
          </Text>
        </View>
      );
    }
    return <CommentDetail nouns={this.state.nouns} />;
  }

  renderPhoto(photo) {
    return (
      <View key={photo.id}>
        <Image
          source={{ uri: photo.link }}
          style={photoStyle}
        />
      </View>
    );
  }

  render() {
    const restaurant = this.props.restaurant;
    return (
      <View style={pageStyle}>
        <View style={headerStyle}>
          <View style={{ marginTop: 5 }}>
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
              {this.timeUntilCloseLabel(this.props.restaurant.hours)}
            </Text>
          </View>

          <View style={{ marginTop: 5 }}>
            <ImageButton
              style={phoneButtonStyle}
              source={phoneButton}
              onPress={() => phonecall(restaurant.phoneNumber.substring(1), false)}
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
          {this.renderPhotoList()}
        </View>

        <Text style={titleStyle}>
          Consensus!
        </Text>
        {this.renderCommentList()}

        <View style={{ flexDirection: 'row' }}>
          <Button onPress={() => this.renderCommentUpload()}>
            Add a comment!
          </Button>
        </View>
      </View>
    );
  }
}

export default RestaurantDetail;
