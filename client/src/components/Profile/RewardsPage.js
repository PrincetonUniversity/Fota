import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Platform, Dimensions } from 'react-native';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../selection.json';

const Icon = createIconSetFromIcoMoon(icoMoonConfig);

const RewardBox = ({ current, required, color, style }) => (
  <View style={[rewardBoxStyle, { borderColor: color }, style]}>
    <Text style={{ fontSize: 16, fontWeight: '500', color }}>
      <Text>
        {current}
      </Text>
      <Text>
        /
      </Text>
      <Text>
        {required}
      </Text>
    </Text>
  </View>
);

class RewardsPage extends Component {
  state = { upvotes: 50, uploads: 10, reviews: 5, redeem: false, activate: false }

  renderReward(necessaryUpvotes, necessaryUploads, necessaryReviews, upvoteBoxColor,
    uploadBoxColor, reviewBoxColor) {
    if (this.state.redeem) {
      return (
        <View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <SimpleLineIcon
              name={'cup'}
              backgroundColor={'#fff'}
              color={'#ff7f00'}
              size={40}
              style={{ marginRight: 12 }}
            />
            <Text style={{ marginTop: 5 }}>
              You won a free boba!
            </Text>
          </View>
        </View>

      );
    }
    return (
      <View>
        <View style={rewardItemContainerStyle}>
          <RewardBox
            current={this.state.upvotes}
            required={necessaryUpvotes}
            color={upvoteBoxColor}
          />
          <Text style={rewardItemTextStyle}>
            {this.renderUpvoteReqText(necessaryUpvotes)}
          </Text>
        </View>

        <View style={rewardItemContainerStyle}>
          <RewardBox
            current={this.state.uploads}
            required={necessaryUploads}
            color={uploadBoxColor}
          />
          <Text style={rewardItemTextStyle}>
            {this.renderUploadReqText(necessaryUploads)}
          </Text>
        </View>

        <View style={rewardItemContainerStyle}>
          <RewardBox
            current={this.state.reviews}
            required={necessaryReviews}
            color={reviewBoxColor}
          />
          <Text style={rewardItemTextStyle}>
            {this.renderReviewReqText(necessaryReviews)}
          </Text>
        </View>
      </View>
    );
  }

  renderUpvoteReqText(necessaryUpvotes) {
    if (this.state.upvotes === necessaryUpvotes) {
      return 'Upvotes completed.';
    }
    return 'Upvotes until next reward.';
  }

  renderUploadReqText(necessaryUploads) {
    if (this.state.uploads === necessaryUploads) {
      return 'Uploads completed.';
    }
    return 'Uploads until next reward.';
  }

  renderReviewReqText(necessaryReviews) {
    if (this.state.reviews === necessaryReviews) {
      return 'Reviews completed.';
    }
    return 'Reviews until next reward.';
  }

  renderRedeem(allComplete, redeemColor) {
    let redeemText = 'REDEEM';
    let onPress = () => { if (allComplete) this.setState({ redeem: true }); };
    if (this.state.redeem) {
      redeemText = 'ACTIVATE';
      onPress = () => { this.setState({ activate: true }); };
    }
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
    const necessaryUpvotes = 50;
    const necessaryUploads = 10;
    const necessaryReviews = 5;
    let upvoteBoxColor = 'rgba(0,0,0,0.7)';
    let uploadBoxColor = 'rgba(0,0,0,0.7)';
    let reviewBoxColor = 'rgba(0,0,0,0.7)';
    let upvoteComplete = false;
    let uploadComplete = false;
    let reviewComplete = false;
    let redeemColor = 'rgba(0,0,0,0.15)';
    let allComplete = false;
    if (this.state.upvotes === necessaryUpvotes) {
      upvoteComplete = true;
      upvoteBoxColor = '#ff7f00';
    }
    if (this.state.uploads === necessaryUploads) {
      uploadComplete = true;
      uploadBoxColor = '#ff7f00';
    }
    if (this.state.reviews === necessaryReviews) {
      reviewComplete = true;
      reviewBoxColor = '#ff7f00';
    }
    if (upvoteComplete && uploadComplete && reviewComplete) {
      allComplete = true;
      redeemColor = '#ff7f00';
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
              <Text style={{ fontWeight: '700' }}>
                {'1 '}
              </Text>
              <Text>
                {'in '}
              </Text>
              <Text style={{ fontWeight: '700' }}>
                {'5 '}
              </Text>
              <Text>
                chance of free boba.
              </Text>
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
              <Text style={{ fontWeight: '700' }}>
                {'100% '}
              </Text>
              <Text>
                chance of a food discount.
              </Text>
            </Text>
          </View>
        </View>

        <View style={rewardContainerStyle}>
          {this.renderReward(
            necessaryUpvotes,
            necessaryUploads,
            necessaryReviews,
            upvoteBoxColor,
            uploadBoxColor,
            reviewBoxColor
          )}
        </View>

        <View>
          {this.renderRedeem(allComplete, redeemColor)}
        </View>
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
    fontSize: 20,
    fontWeight: '700'
  },
  infoAnswerStyle: {
    marginTop: 5,
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
