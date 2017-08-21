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
import { View, Image, Text, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Ionicon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import request from '../../helpers/axioshelper';
import { photoVote } from '../../helpers/URL';
import { GradientImage, ImageButton } from '../common';
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
    // const user = this.props.loginState;
    // let queryString = '';
    // if (!user) {
    //   queryString = `https://fotafood.herokuapp.com/api/photo/${this.state.id}?type=${type}&amount=${amount}`;
    // } else {
    //   queryString = `https://fotafood.herokuapp.com/api/photo/${this.state.id}?type=${type}&amount=${amount}&user=${user.uid}`;
    // }
    request.patch(photoVote(this.state.id, type))
    //request.patch(queryString)
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
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                <View style={{ flex: 2 }} />

                <Text style={{ color: voteCountColor, ...voteCountTextStyle }}>
                  {this.state.votecount.toString()}
                </Text>
                <TouchableOpacity onPress={() => this.renderDownvote()}>
                  <Ionicon
                    name='ios-arrow-down'
                    size={40}
                    color={downvoteColor}
                    backgroundColor='transparent'
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.renderUpvote()}>
                  <Ionicon
                    name='ios-arrow-up'
                    size={40}
                    color={upvoteColor}
                    backgroundColor='transparent'
                    style={{ marginRight: 20 }}
                  />
                </TouchableOpacity>
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
  },
  photoStyle: { // The picture
    flex: 1,
    // width: 327,
    // height: 327,
    width: null,
    height: Dimensions.get('window').width - 65,
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  photoInfoStyle: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'relative',
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15
  },
  upvoteStyle: { // Upvote/downvote
    height: 35,
    width: 35
  },
  downvoteStyle: { // Downvote
    height: 35,
    width: 35,
    marginLeft: 20,
    marginRight: 10
  },
  voteCountContainerStyle: { // Upvote arrow + number of likes container
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10
  },
  voteCountArrowStyle: { // the arrow next to number of likes
    height: 13,
    width: 13
  },
  voteCountTextStyle: { // Number of likes
    fontFamily: 'Avenir',
    fontSize: 18,
    textAlign: 'justify',
    fontWeight: 'bold',
    marginRight: 10,
    marginBottom: 10
  },
  voteContainerStyle: { // Upvote/downvote container
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
};

const {
  photoFrameStyle,
  photoStyle,
  photoInfoStyle,
  upvoteStyle,
  downvoteStyle,
  voteCountContainerStyle,
  voteCountArrowStyle,
  voteCountTextStyle,
  voteContainerStyle
} = styles;

function mapStateToProps({ loginState }) {
  return { loginState };
}

export default connect(mapStateToProps)(PhotoDetail);
