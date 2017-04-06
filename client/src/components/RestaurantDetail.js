import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import { ImageButton } from './common';
import { footerSize } from './common/Footer';

const styles = {
  restaurantCardStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: footerSize,
    marginLeft: 15,
    marginTop: 20,
    marginRight: 15,
    backgroundColor: '#F8F8F8',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2
  },
  backButtonStyle: {
    width: 30,
    height: 30
  }
};

const { restaurantCardStyle, backButtonStyle } = styles;
const backButton = require('../img/fota_home_button_activated.png');

class RestaurantDetail extends Component {

  componentWillMount() {
    //axios.get();
  }

  renderBack() {
    this.props.navigator.push({ name: 'Photo List' });
  }

  render() {
    const restaurant = this.props.restaurant;
    return (
      <View style={restaurantCardStyle}>
        <ImageButton
          style={backButtonStyle}
          source={backButton}
          onPress={() => this.props.close()}
        />
        <Text>
          {restaurant.name}
        </Text>
        <Text>
          {restaurant.phoneNumber}
        </Text>
      </View>
    );
  }
}

export default RestaurantDetail;
