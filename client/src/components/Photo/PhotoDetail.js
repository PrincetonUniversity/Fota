/******************************************************************************
 * Called by: ./PhotoList
 * Dependencies: redux, helpers/axioshelper,
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
import RestaurantModal from '../Restaurant/RestaurantModal';
import { GradientImage } from '../common';
import { voteOnPhotoTable } from '../../actions';
import request from '../../helpers/axioshelper';
import { photoVote } from '../../helpers/URL';

class PhotoDetail extends Component {
  constructor(props) {
    super(props);
    if (props.shouldRenderWithRedux) {
      const photo = props.photoTable[props.photo.id];
      const userHasVoted = photo.user_upvote || photo.user_downvote;
      this.state = {
        photo,
        userLiked: photo.user_upvote,
        userDisliked: photo.user_downvote,
        userHasVoted,
        votecount: photo.vote_count,
        modalVisible: false
      };
    } else {
      const userHasVoted = props.photo.user_upvote || props.photo.user_downvote;
      this.state = {
        photo: props.photo,
        userLiked: props.photo.user_upvote,
        userDisliked: props.photo.user_downvote,
        userHasVoted,
        votecount: props.photo.vote_count,
        modalVisible: false,
      };
    }
    this.timer = null;
    this.oldValue = null;
  }

  componentWillReceiveProps(newProps) {
    if (newProps.shouldRenderWithRedux) {
      const id = newProps.photo.id;
      if (this.props.photoTable && newProps.photoTable[id] !== this.props.photoTable[id]) {
        const photo = newProps.photoTable[id];
        const userHasVoted = photo.user_upvote || photo.user_downvote;
        this.setState({
          userLiked: photo.user_upvote,
          userDisliked: photo.user_downvote,
          userHasVoted,
          votecount: photo.vote_count,
        });
      }
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  sendUpdateRequest(type, newCount, newLike, newDislike) {
    const patch = () => {
      const temp = this.oldValue;
      this.timer = null;
      this.oldValue = null; 
      if (temp === type) return;
      if (this.props.shouldRenderWithRedux) {
        this.props.voteOnPhotoTable(this.state.photo.id, newCount, newLike, newDislike);
      }
      request.patch(photoVote(this.state.photo.id, type))
        .catch(e => request.showErrorAlert(e));
    };
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(patch, 1000);
  }

  renderUpvote() {
    let newVoteCount = this.state.votecount;
    let userNewLike = true;
    let userVoted = true;
    if (!this.state.userHasVoted) {
      newVoteCount += 1;
      if (this.oldValue == null) this.oldValue = 'clear';
      this.sendUpdateRequest('up', newVoteCount, userNewLike, false);
    } else if (this.state.userDisliked) {
        newVoteCount += 2;
        if (this.oldValue == null) this.oldValue = 'down';
        this.sendUpdateRequest('up', newVoteCount, userNewLike, false);
    } else if (this.state.userLiked) {
        newVoteCount -= 1;
        userNewLike = false;
        userVoted = false;
        if (this.oldValue == null) this.oldValue = 'up';
        this.sendUpdateRequest('clear', newVoteCount, userNewLike, false);
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
      if (this.oldValue == null) this.oldValue = 'clear';
      this.sendUpdateRequest('down', newVoteCount, false, userHasDisliked);
    } else if (this.state.userLiked) {
      newVoteCount -= 2;
      if (this.oldValue == null) this.oldValue = 'up';
      this.sendUpdateRequest('down', newVoteCount, false, userHasDisliked);
    } else if (this.state.userDisliked) {
      newVoteCount += 1;
      userHasDisliked = false;
      userVoted = false;
      if (this.oldValue == null) this.oldValue = 'down';
      this.sendUpdateRequest('clear', newVoteCount, false, userHasDisliked);
    }
    this.setState({
      votecount: newVoteCount,
      userLiked: false,
      userDisliked: userHasDisliked,
      userHasVoted: userVoted,
    });
  }

  renderDistance() {
    if (this.state.photo.distance) {
      return (
        <View style={distanceContainerStyle}>
          <Text style={distanceTextStyle}>
            {`${this.state.photo.distance.toFixed(1)} mi`}
          </Text>
        </View>
      );
    }
  }

  render() {
    const upvoteColor = this.state.userLiked === true ? 'white' : 'rgba(255, 255, 255, 0.6)';
    const downvoteColor = this.state.userDisliked === true ? 'white' : 'rgba(255, 255, 255, 0.6)';
    return (
      <View>
        <RestaurantModal
          restaurantid={this.state.photo.rest_id}
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
              source={this.state.photo.url}
            >
              <View style={{ flex: 1, zIndex: 6 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                  {this.renderDistance()}

                  <View style={voteContainerStyle}>
                    <Text style={voteTextStyle}>
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
    color: 'white'
  },
  voteContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  voteTextStyle: { // Text at bottom of photo
    fontSize: 16,
    fontWeight: '900',
    marginRight: 10,
    paddingTop: 8,
    paddingBottom: 13,
    color: 'white'
  }
};

const {
  photoFrameStyle,
  photoStyle,
  distanceContainerStyle,
  distanceTextStyle,
  voteContainerStyle,
  voteTextStyle,
} = styles;

function mapStateToProps({ photoTable }) {
  return { photoTable };
}

export default connect(mapStateToProps, { voteOnPhotoTable })(PhotoDetail);
