import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Platform, Dimensions, AsyncStorage } from 'react-native';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import request from '../../helpers/axioshelper';
import { redeemRequest } from '../../helpers/URL';
import icoMoonConfig from '../../selection.json';

const Icon = createIconSetFromIcoMoon(icoMoonConfig);

export const NECESSARY_REVIEWS = 5;
export const NECESSARY_UPLOADS = 10;
export const NECESSARY_UPVOTES = 50;

const BOBA_REWARD = 'ewr23deewyty';
const DISCOUNT_REWARD = 'weft5rwee';
const BOBA_ACTIVATED = '930423dfijo';
const DISCOUNT_ACTIVATED = 'u98r3jfgker';

const RewardBox = ({ current, required, style }) => {
  const color = (current === required) ? '#ff7f00' : 'rgba(0,0,0,0.7)';
  return (
    <View style={[rewardBoxStyle, { borderColor: color }, style]}>
      <Text style={{ fontSize: 16, fontWeight: '500', color }}>
        <Text>{current}</Text>
        <Text>/</Text>
        <Text>{required}</Text>
      </Text>
    </View>
  );
};

class RewardsPage extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, redeemStage: 0 };
    this.buttonPressed = false;
  }

  componentWillMount() {
    AsyncStorage.getItem('Reward').then(reward => {
      let redeemStage = 0;
      if (reward === BOBA_REWARD) {
        redeemStage = 1;        
      } else if (reward === DISCOUNT_REWARD) {
        redeemStage = 2;        
      } else if (reward === BOBA_ACTIVATED) {
        redeemStage = 3;
      } else if (reward === DISCOUNT_ACTIVATED) {
        redeemStage = 4;
      }
      this.setState({ loading: false, redeemStage });
    }).catch(() => {
      this.setState({ loading: false });
    });
  }

  redeemReward() {
    this.buttonPressed = true;
    const randomValue = Math.floor(Math.random() * 5);
    console.log(randomValue);
    if (randomValue === 0) {
      AsyncStorage.setItem('Reward', BOBA_REWARD).then(() => {
        this.setState({ redeemStage: 1 });
        this.buttonPressed = false;
      });
    } else {
      AsyncStorage.setItem('Reward', DISCOUNT_REWARD).then(() => {
        this.setState({ redeemStage: 2 });
        this.buttonPressed = false;        
      });
    }
  }

  activateReward() {
    this.buttonPressed = true;
//  request.post(redeemRequest()).then(() => {
      if (this.state.redeemStage === 1) {
        AsyncStorage.setItem('Reward', BOBA_ACTIVATED).then(() => {
          this.setState({ redeemStage: 3 });
          this.buttonPressed = false;
        });
      } else if (this.state.redeemStage === 2) {
        AsyncStorage.setItem('Reward', DISCOUNT_ACTIVATED).then(() => {
          this.setState({ redeemStage: 4 });
          this.buttonPressed = false;
        });
      }
/*  }).catch(e => { 
      this.buttonPressed = false;
      request.showErrorAlert(e);
    });*/
  }

  renderReward() {
    if (this.state.loading) {
      return null;
    }
    if (this.state.redeemStage > 0) {
      let message = 'You got free boba!';
      let icon = 'cup';
      if (this.state.redeemStage === 2) {
        message = 'You got a 10% discount from Fruity Yogurt!';
        icon = 'tag';
      }
      return (
        <View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <SimpleLineIcon
              name={icon}
              backgroundColor={'#fff'}
              color={'#ff7f00'}
              size={40}
              style={{ marginRight: 12 }}
            />
            <Text style={{ marginTop: 5, ...posItemTextStyle }}>
              {message}
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View>
        <View style={rewardItemContainerStyle}>
          <RewardBox
            current={this.props.screenProps.rewardState.upvotes}
            required={NECESSARY_UPVOTES}
          />
          <Text style={rewardItemTextStyle}>{this.renderUpvoteReqText()}</Text>
        </View>

        <View style={rewardItemContainerStyle}>
          <RewardBox
            current={this.props.screenProps.rewardState.uploads}
            required={NECESSARY_UPLOADS}
          />
          <Text style={rewardItemTextStyle}>{this.renderUploadReqText()}</Text>
        </View>

        <View style={rewardItemContainerStyle}>
          <RewardBox
            current={this.props.screenProps.rewardState.reviews}
            required={NECESSARY_REVIEWS}
          />
          <Text style={rewardItemTextStyle}>{this.renderReviewReqText()}</Text>
        </View>
      </View>
    );
  }

  renderUpvoteReqText() {
    return (this.props.screenProps.rewardState.upvotes === NECESSARY_UPVOTES) ?
    'Upvotes completed.' : 'Upvotes until next reward.';
  }

  renderUploadReqText() {
    return (this.props.screenProps.rewardState.uploads === NECESSARY_UPLOADS) ?
    'Uploads completed.' : 'Uploads until next reward.';
  }

  renderReviewReqText() {
    return (this.props.screenProps.rewardState.reviews === NECESSARY_REVIEWS) ?
    'Reviews completed.' : 'Reviews until next reward.';
  }

  renderRedeem(allComplete) {
    if (this.state.loading) {
      return null;
    }
    let redeemText = 'REDEEM';
    let onPress = () => {
      if (this.buttonPressed) return;
      if (allComplete) this.redeemReward(); 
    };
    if (this.state.redeemStage > 0) {
      redeemText = 'ACTIVATE';
      onPress = () => { 
        if (this.buttonPressed) return;
        this.activateReward(); 
      };
    }
    const redeemColor = allComplete ? '#ff7f00' : 'rgba(0,0,0,0.15)';
    return (
      <TouchableOpacity
        onPress={onPress}
      >
        <View style={[redeemButtonStyle, { backgroundColor: redeemColor }]}>
          <Text style={{ fontSize: 15, color: 'white', fontWeight: '700' }}>
            {redeemText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    let upvoteComplete = false;
    let uploadComplete = false;
    let reviewComplete = false;
    let allComplete = false;
    if (this.props.screenProps.rewardState.upvotes === NECESSARY_UPVOTES) {
      upvoteComplete = true;
    }
    if (this.props.screenProps.rewardState.uploads === NECESSARY_UPLOADS) {
      uploadComplete = true;
    }
    if (this.props.screenProps.rewardState.reviews === NECESSARY_REVIEWS) {
      reviewComplete = true;
    }
    if (upvoteComplete && uploadComplete && reviewComplete) {
      allComplete = true;
    }

    if (this.state.redeemStage >= 3) {
      const text = (this.state.redeemStage === 4) ? 'discount' : 'boba';
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity 
            onPress={() => {
              AsyncStorage.setItem('Reward', 'None').then(() => {
                this.setState({ redeemStage: 0 });
              });              
            }}
          >
            <View><Text>{`You redeemed a ${text} reward!`}</Text></View>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={headerStyle}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
            >
              <Icon
                name={'close'}
                backgroundColor='white'
                color='black'
                size={16}
              />
            </TouchableOpacity>
          </View>

          <View style={titleContainerStyle}>
            <SimpleLineIcon
              name={'present'}
              backgroundColor={'#fff'}
              color={'#ff7f00'}
              size={40}
              style={{ marginRight: 12 }}
            />
            <Text style={titleTextStyle}>
              REWARDS
            </Text>
          </View>

          <View style={{ flex: 1 }} />
        </View>

        <View style={infoContainerStyle}>
          <Text style={infoPromptStyle}>
            Want to get free food and discounts?
          </Text>
          <Text style={infoAnswerStyle}>
            Simply upload, upvote, and review.
          </Text>
        </View>

        <View style={posRewardsContainerStyle}>
          <View style={posItemStyle}>
            <SimpleLineIcon
              name={'cup'}
              backgroundColor={'#fff'}
              color={'#ff7f00'}
              size={40}
              style={{ marginRight: 12 }}
            />
            <Text style={posItemTextStyle}>
              <Text style={{ fontWeight: '700' }}>{'1 '}</Text>
              <Text>{'in '}</Text>
              <Text style={{ fontWeight: '700' }}>{'5 '}</Text>
              <Text>chance of free boba.</Text>
            </Text>
          </View>
          <View style={[posItemStyle, { marginTop: 10 }]}>
            <SimpleLineIcon
              name={'tag'}
              backgroundColor={'#fff'}
              color={'#ff7f00'}
              size={40}
              style={{ marginRight: 12 }}
            />
            <Text style={posItemTextStyle}>
              <Text style={{ fontWeight: '700' }}>{'100% '}</Text>
              <Text>chance of a food discount.</Text>
            </Text>
          </View>
        </View>

        <View style={rewardContainerStyle}>{this.renderReward()}</View>
        <View>{this.renderRedeem(allComplete)}</View>
      </View>
    );
  }
}

const styles = {
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginTop: Platform.OS === 'ios' ? 35 : 20,
    marginHorizontal: 20,
  },
  titleContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  titleTextStyle: {
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.8)',    
    fontSize: 28,
    fontWeight: '900'
  },
  infoContainerStyle: {
    paddingVertical: 20,
    marginTop: 20,
    marginHorizontal: 25,
    borderColor: 'rgba(0,0,0,0.15)',
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  infoPromptStyle: {
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.8)',    
    fontSize: 20,
    fontWeight: '700'
  },
  infoAnswerStyle: {
    marginTop: 5,
    color: 'rgba(0, 0, 0, 0.8)',    
    textAlign: 'center',
    fontSize: 14
  },
  posRewardsContainerStyle: {
    paddingVertical: 15,
    marginHorizontal: 25,
    borderColor: 'rgba(0,0,0,0.15)',
    borderBottomWidth: 1,
    justifyContent: 'space-around'
  },
  posItemStyle: {
    flexDirection: 'row',
    marginLeft: 20,
    alignItems: 'center'
  },
  posItemTextStyle: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.8)',    
    textAlign: 'center'
  },
  rewardContainerStyle: {
    flex: 1,
    marginHorizontal: 25,
    paddingVertical: 15,
    paddingLeft: 20
  },
  rewardItemContainerStyle: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center'
  },
  rewardItemTextStyle: {
    marginLeft: 15,
    color: 'rgba(0, 0, 0, 0.8)',    
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 14
  },
  rewardBoxStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 33,
    borderWidth: 3,
    borderRadius: 11,
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 2
  },
  redeemButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 35,
    marginLeft: Dimensions.get('window').width / 2 - 50,
    marginRight: Dimensions.get('window').width / 2 - 50,
    width: 110,
    height: 31,
    borderRadius: 17
  }
};

const {
  headerStyle,
  titleContainerStyle,
  titleTextStyle,
  infoContainerStyle,
  infoPromptStyle,
  infoAnswerStyle,
  posRewardsContainerStyle,
  posItemStyle,
  posItemTextStyle,
  rewardContainerStyle,
  rewardItemContainerStyle,
  rewardItemTextStyle,
  rewardBoxStyle,
  redeemButtonStyle
} = styles;

export default RewardsPage;
