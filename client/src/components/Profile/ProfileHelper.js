/******************************************************************************
 * Called by: Base
 * Dependencies: common/Header, ./UserPage, ./LoginForm, redux
 *
 * Description: Returns either the user page (./UserPage) or the login form
 * (./LoginForm) depending on whether the user is logged in or not.
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { StackNavigator } from 'react-navigation';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
//mport LoginPage from '../Account/LoginPage';
import ProfilePage from './ProfilePage';
import SettingsPage from '../Settings/SettingsPage';
import SettingsRadioButton from '../Settings/SettingsRadioButton';
import { tabWidth, tabHeight, horizontalPadding } from '../../Base';
import icoMoonConfig from '../../selection.json';

const Icon = createIconSetFromIcoMoon(icoMoonConfig);

class ProfileHelper extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    tabBarIcon: ({ focused }) => {
      let color = '#ccc';
      if (focused) color = '#ff9700';
      return (
        <TouchableOpacity
          style={{
            width: tabWidth + horizontalPadding * 2,
            height: tabHeight,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => {
            if (screenProps.user && !screenProps.user.isAnonymous) {
              if (!focused) {
                navigation.navigate('Account');
              }
            } else {
              navigation.navigate('Login', { onLoginFinished: 'openAccount' });
            }
          }}
        >
          <Icon
            name={'profile'}
            color={color}
            size={32}
            style={{
              width: 38,
              textAlign: 'center',
            }}
          />
        </TouchableOpacity>
      );
    }
  });

  render() {
    if (!this.props.loginState || this.props.loginState.isAnonymous) {
      return <View />;
    }
    return (
      <ProfileNavigator 
        screenProps={{ user: this.props.loginState, testuser }}
      />
    );
  }
}

const SettingsRadius = (props) => (
  <SettingsRadioButton
    title='Search Radius'
    name='SearchRadius'
    extraText=' mi.'
    options={['1', '3', '5', '10']}
    navigation={props.navigation}
  />
);

const ProfileNavigator = StackNavigator({
  Profile: { screen: ProfilePage },
  Settings: { screen: SettingsPage },
  Radius: { screen: SettingsRadius }
},
{
  headerMode: 'none',
  cardStyle: {
    backgroundColor: '#fff'
  }
});

const testuser = {
  bookmarked: [
    {"id":"rocky-hill-inn-eatery-and-tavern-rocky-hill","name":"Rocky Hill Inn Eatery & Tavern","phone":"+16096838930","display_phone":"(609) 683-8930","categories":[{"alias":"newamerican","title":"American (New)"},{"alias":"gastropubs","title":"Gastropubs"}],"location":{"address1":"137 Washington St","address2":"","address3":"","city":"Rocky Hill","zip_code":"08553","country":"US","state":"NJ","display_address":["137 Washington St","Rocky Hill, NJ 08553"],"cross_streets":""},"price":"$$","hours":[{"open":[{"is_overnight":false,"start":"1130","end":"2100","day":0},{"is_overnight":false,"start":"1130","end":"2100","day":1},{"is_overnight":false,"start":"1130","end":"2100","day":2},{"is_overnight":false,"start":"1130","end":"2100","day":3},{"is_overnight":false,"start":"1130","end":"2200","day":4},{"is_overnight":false,"start":"1700","end":"2200","day":5},{"is_overnight":false,"start":"1700","end":"2100","day":6}],"hours_type":"REGULAR","is_open_now":false}],"photos":[{"url":"https://s3-media3.fl.yelpcdn.com/bphoto/-1xIfezEraPK2HRTHWIWMA/o.jpg"},{"url":"https://s3-media3.fl.yelpcdn.com/bphoto/-1xIfezEraPK2HRTHWIWMA/o.jpg"}]},
    {"id":"chennai-chimney-princeton-2","name":"Chennai Chimney","phone":"+16096080104","display_phone":"(609) 608-0104","categories":[{"alias":"indpak","title":"Indian"}],"location":{"address1":"19 Chambers St","address2":null,"address3":"","city":"Princeton","zip_code":"08542","country":"US","state":"NJ","display_address":["19 Chambers St","Princeton, NJ 08542"],"cross_streets":""},"price":"$$","hours":[{"open":[{"is_overnight":false,"start":"1100","end":"1430","day":1},{"is_overnight":false,"start":"1700","end":"2200","day":1},{"is_overnight":false,"start":"1100","end":"1430","day":2},{"is_overnight":false,"start":"1700","end":"2200","day":2},{"is_overnight":false,"start":"1100","end":"1430","day":3},{"is_overnight":false,"start":"1700","end":"2200","day":3},{"is_overnight":false,"start":"1130","end":"1430","day":4},{"is_overnight":false,"start":"1700","end":"2200","day":4},{"is_overnight":false,"start":"1130","end":"1430","day":5},{"is_overnight":false,"start":"1700","end":"2200","day":5},{"is_overnight":false,"start":"1130","end":"1430","day":6},{"is_overnight":false,"start":"1700","end":"2130","day":6}],"hours_type":"REGULAR","is_open_now":true}],"photos":[{"url":"https://s3-media2.fl.yelpcdn.com/bphoto/nEbN823WqzS-3G_M2AZu8A/o.jpg"},{"url":"https://s3-media2.fl.yelpcdn.com/bphoto/nEbN823WqzS-3G_M2AZu8A/o.jpg"}]},
    {"id":"alchemist-and-barrister-princeton","name":"Alchemist & Barrister","phone":"+16099245555","display_phone":"(609) 924-5555","categories":[{"alias":"pubs","title":"Pubs"},{"alias":"tradamerican","title":"American (Traditional)"},{"alias":"sportsbars","title":"Sports Bars"}],"location":{"address1":"28 Witherspoon St","address2":"","address3":"","city":"Princeton","zip_code":"08540","country":"US","state":"NJ","display_address":["28 Witherspoon St","Princeton, NJ 08540"],"cross_streets":""},"price":"$$","hours":[{"open":[{"is_overnight":true,"start":"1130","end":"0200","day":0},{"is_overnight":true,"start":"1130","end":"0200","day":1},{"is_overnight":true,"start":"1130","end":"0200","day":2},{"is_overnight":true,"start":"1130","end":"0200","day":3},{"is_overnight":true,"start":"1130","end":"0200","day":4},{"is_overnight":true,"start":"1130","end":"0200","day":5},{"is_overnight":true,"start":"1100","end":"0200","day":6}],"hours_type":"REGULAR","is_open_now":true}],"photos":[{"url":"https://fota-app.s3.amazonaws.com/%2Fc8q8hw60H2Pi0HyuD9WePpvWMx32_alchemist-and-barrister-princeton_335D54D9-0E05-4CA1-AC98-1F9B00F43FAF.jpg.jpg"},{"url":"https://s3-media2.fl.yelpcdn.com/bphoto/T6pAtgCsSyUZ07jY2Bc88Q/o.jpg"}]}
  ],
  upvoted: [
    {"id":"cfa41c10-726d-11e7-aa1d-957dec4cbef2","url":"https://s3-media3.fl.yelpcdn.com/bphoto/-1xIfezEraPK2HRTHWIWMA/o.jpg","vote_count":3,"rest_id":"rocky-hill-inn-eatery-and-tavern-rocky-hill","user_upvote":true,"user_downvote":false,"uploaded_at":"2017-07-27T01:49:21.588Z"},
    {"id":"cf6935f0-726d-11e7-aa1d-957dec4cbef2","url":"https://s3-media2.fl.yelpcdn.com/bphoto/nEbN823WqzS-3G_M2AZu8A/o.jpg","vote_count":0,"rest_id":"chennai-chimney-princeton-2","user_upvote":false,"user_downvote":false,"uploaded_at":"2017-07-27T01:49:21.417Z"},
    {"id":"df87cc30-726d-11e7-9d5a-3b58874f0c3d","url":"https://fota-app.s3.amazonaws.com/%2FKXE2BSBaJZer7LygXxhMQf0ucr62_masa-sushi-princeton_1495407630388.JPEG.jpg","vote_count":0,"rest_id":"masa-sushi-princeton","user_upvote":false,"user_downvote":false,"uploaded_at":"2017-07-27T01:49:48.248Z"},
    {"id":"cfb07820-726d-11e7-aa1d-957dec4cbef2","url":"https://s3-media2.fl.yelpcdn.com/bphoto/b0TW6XRrAB0Pgbo9PhUUng/o.jpg","vote_count":0,"rest_id":"paradise-biryani-pointe-lawrenceville-2","user_upvote":false,"user_downvote":false,"uploaded_at":"2017-07-27T01:49:21.669Z"}
  ],
  uploaded: [
    {"id":"dfae3ff0-726d-11e7-9d5a-3b58874f0c3d","url":"https://s3-media2.fl.yelpcdn.com/bphoto/v9312pqoGXOk4EX2Kpzo0Q/o.jpg","vote_count":0,"rest_id":"roots-princeton","user_upvote":false,"user_downvote":false,"uploaded_at":"2017-07-27T01:49:48.500Z"},
    {"id":"e060ee20-726d-11e7-9d5a-3b58874f0c3d","url":"https://s3-media2.fl.yelpcdn.com/bphoto/bRhajOhfEIGNvO77xkQraQ/o.jpg","vote_count":0,"rest_id":"trattoria-procaccini-princeton","user_upvote":false,"user_downvote":false,"uploaded_at":"2017-07-27T01:49:49.670Z"},
    {"id":"e0751260-726d-11e7-9d5a-3b58874f0c3d","url":"https://s3-media2.fl.yelpcdn.com/bphoto/YVDKLYbXvGqDYfCiVIs6XQ/o.jpg","vote_count":0,"rest_id":"salt-creek-grille-princeton","user_upvote":false,"user_downvote":false,"uploaded_at":"2017-07-27T01:49:50.035Z"}
  ],
  comments: [

  ]
};

function mapStateToProps({ loginState, mainNavigator }) {
  return { loginState, mainNavigator };
}

export default connect(mapStateToProps)(ProfileHelper);
