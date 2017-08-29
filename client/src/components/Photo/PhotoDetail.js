/******************************************************************************
 * Called by: ./PhotoList
 * Dependencies: redux, helpers/axioshelper, helpers/getasyncstorage,
 * common/ImageButton, Restaurant/RestaurantModal
 *
 * Description: Visual component for each photo on the home page. Consists of
 * the photo frame, upvote/downvote button and logic, and the upvote count.
 *
 * After a user votes on the photo, sends upvote/downvote information along
 * with the user/phone ID depending on whether the user is logged in or not.
 * Tapping a photo brings up the restaurant page (Restaurant/RestaurantModal)
 * associated with the photo. Long pressing the photo brings up a "Report as
 * Spam" option (done through Restaurant/RestaurantModal).
 *
 ******************************************************************************/

import React, { Component } from 'react';
import { View, Text, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Ionicon from 'react-native-vector-icons/Ionicons';
import request from '../../helpers/axioshelper';
import { photoVote } from '../../helpers/URL';
import { GradientImage } from '../common';
import RestaurantModal from '../Restaurant/RestaurantModal';
import saveVote from '../../helpers/getasyncstorage';

class PhotoDetail extends Component {
  constructor(props) {
    super(props);
    if (!props.vote) {
      this.state = {
        url: props.photo.url,
        votecount: props.photo.vote_count,
        id: props.photo.id,
        userLiked: false,
        userDisliked: false,
        userHasVoted: false,
        modalVisible: false
      };
    } else if (props.vote === 'liked') {
        this.state = {
          url: props.photo.url,
          votecount: props.photo.vote_count,
          id: props.photo.id,
          userLiked: true,
          userDisliked: false,
          userHasVoted: true,
          modalVisible: false
        };
    } else if (props.vote === 'disliked') {
        this.state = {
          url: props.photo.url,
          votecount: props.photo.vote_count,
          id: props.photo.id,
          userLiked: false,
          userDisliked: true,
          userHasVoted: true,
          modalVisible: false
        };
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  // Sends the update request to the fota server.
  // type can either be "downvote" or "upvote"
  sendUpdateRequest(type) {
    request.patch(photoVote(this.state.id, type))
    .catch(e => request.showErrorAlert(e));
  }

  renderUpvote() {
    let newVoteCount = this.state.votecount;
    let userNewLike = true;
    let userVoted = true;
    if (!this.state.userHasVoted) {
      newVoteCount += 1;
      saveVote(1, this.state.id).done();
      this.sendUpdateRequest('up');
    } else if (this.state.userDisliked) {
        newVoteCount += 2;
        saveVote(4, this.state.id).done();
        this.sendUpdateRequest('up');
    } else if (this.state.userLiked) {
        newVoteCount -= 1;
        userNewLike = false;
        userVoted = false;
        saveVote(5, this.state.id).done();
        this.sendUpdateRequest('clear');
    }
    this.setState({
      votecount: newVoteCount,
      userLiked: userNewLike,
      userDisliked: false,
      userHasVoted: userVoted,
    });
  }

  renderDownvote() {
    let newVoteCount = this.state.votecount;
    let userHasDisliked = true;
    let userVoted = true;
    if (!this.state.userHasVoted) {
      newVoteCount -= 1;
      saveVote(2, this.state.id).done();
      this.sendUpdateRequest('down');
    } else if (this.state.userLiked) {
      newVoteCount -= 2;
      saveVote(3, this.state.id).done();
      this.sendUpdateRequest('down');
    } else if (this.state.userDisliked) {
      newVoteCount += 1;
      userHasDisliked = false;
      userVoted = false;
      saveVote(6, this.state.id).done();
      this.sendUpdateRequest('clear');
    }
    this.setState({
      votecount: newVoteCount,
      userLiked: false,
      userDisliked: userHasDisliked,
      userHasVoted: userVoted,
    });
  }

  render() {
    const upvoteColor = this.state.userLiked === true ? 'white' : 'rgba(255, 255, 255, 0.6)';
    const downvoteColor = this.state.userDisliked === true ? 'white' : 'rgba(255, 255, 255, 0.6)';
    const voteCountColor = 'white';
    return (
      <View>
        <RestaurantModal
          restaurantid={this.props.restaurantid}
          options={[{
            name: 'Report as Spam',
            onClick: () => setTimeout(() => Alert.alert(
                  '',
                  'This photo has been reported. Thanks for letting us know!',
                  [{ text: 'OK' }]
                ), 550)
          }]}
        >
          <View style={photoFrameStyle}>
            <GradientImage
              start={{ x: 0.5, y: 0.58 }}
              end={{ x: 0.5, y: 1.0 }}
              colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
              photoStyle={photoStyle}
              gradientStyle={{ flex: 1 }}
              source={this.state.url}
            >
              <View style={{ flex: 1, zIndex: 6 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                  <View style={distanceContainerStyle}>
                    <Text style={{ color: voteCountColor, ...distanceTextStyle }}>
                      {`${this.props.photo.distance.toFixed(1)} mi`}
                    </Text>
                  </View>

                  <View style={voteContainerStyle}>
                    <Text style={{ color: voteCountColor, ...voteTextStyle }}>
                      {this.state.votecount.toString()}
                    </Text>
                    <TouchableOpacity onPress={() => this.renderDownvote()}>
                      <Ionicon
                        name='ios-arrow-down'
                        size={40}
                        color={downvoteColor}
                        backgroundColor='transparent'
                        style={{ marginRight: 10, marginVertical: 0 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.renderUpvote()}>
                      <Ionicon
                        name='ios-arrow-up'
                        size={40}
                        color={upvoteColor}
                        backgroundColor='transparent'
                        style={{ marginRight: 20, marginVertical: 0 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </GradientImage>
          </View>
        </RestaurantModal>
      </View>
    );
  }
}

const styles = {
  photoFrameStyle: {
    borderRadius: 9,
    overflow: 'hidden',
    zIndex: 1
  },
  photoStyle: { // The picture
    flex: 1,
    // width: 327,
    // height: 327,
    width: null,
    height: Dimensions.get('window').width - 50,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 9
  },
  distanceContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  distanceTextStyle: { // Text at bottom of photo
    fontSize: 15,
    fontWeight: '900',
    paddingLeft: 16,
    paddingTop: 8,
    letterSpacing: 1,
    paddingBottom: 14,
    color: 'rgba(255,255,255,0.95)'
  },
  voteContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  voteTextStyle: { // Text at bottom of photo
    fontSize: 16,
    //textAlign: 'justify',
    fontWeight: '900',
    marginRight: 10,
    paddingTop: 8,
    paddingBottom: 13,
    //marginBottom: 10
  },
  // photoInfoStyle: {
  //   paddingTop: 10,
  //   paddingBottom: 10,
  //   backgroundColor: '#FFFFFF',
  //   borderBottomLeftRadius: 7,
  //   borderBottomRightRadius: 7,
  //   justifyContent: 'space-between',
  //   flexDirection: 'row',
  //   position: 'relative',
  //   shadowOffset: { width: 1, height: 5 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 15
  // },
};

const {
  photoFrameStyle,
  photoStyle,
  distanceContainerStyle,
  distanceTextStyle,
  voteContainerStyle,
  voteTextStyle,
} = styles;

function mapStateToProps({ loginState }) {
  return { loginState };
}

export default connect(mapStateToProps)(PhotoDetail);
