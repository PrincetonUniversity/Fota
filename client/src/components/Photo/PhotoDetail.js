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
import request from '../../helpers/axioshelper';
import { ImageButton } from '../common';
import RestaurantModal from '../Restaurant/RestaurantModal';
import saveVote from '../../helpers/getasyncstorage';

class PhotoDetail extends Component {
  constructor(props) {
    super(props);
    if (!props.vote) {
      this.state = {
        link: props.photo.link,
        likecount: props.photo.likecount,
        id: props.photo.id,
        userLiked: false,
        userDisliked: false,
        userHasVoted: false,
        modalVisible: false
      };
    } else if (props.vote === 'liked') {
        this.state = {
          link: props.photo.link,
          likecount: props.photo.likecount,
          id: props.photo.id,
          userLiked: true,
          userDisliked: false,
          userHasVoted: true,
          modalVisible: false
        };
    } else if (props.vote === 'disliked') {
        this.state = {
          link: props.photo.link,
          likecount: props.photo.likecount,
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
  sendUpdateRequest(type, amount) {
    const user = this.props.loginState;
    let queryString = '';
    if (!user) {
      queryString = `https://fotafood.herokuapp.com/api/photo/${this.state.id}?type=${type}&amount=${amount}`;
    } else {
      queryString = `https://fotafood.herokuapp.com/api/photo/${this.state.id}?type=${type}&amount=${amount}&user=${user.uid}`;
    }
    request.patch(queryString)
    .catch(e => request.showErrorAlert(e));
  }

  renderUpvote() {
    let newLikeCount = this.state.likecount;
    let userNewLike = true;
    let userVoted = true;
    if (!this.state.userHasVoted) {
      newLikeCount += 1;
      saveVote(1, this.state.id).done();
      this.sendUpdateRequest('upvote', '1');
    } else if (this.state.userDisliked) {
        newLikeCount += 2;
        saveVote(4, this.state.id).done();
        this.sendUpdateRequest('upvote', '2');
    } else if (this.state.userLiked) {
        newLikeCount -= 1;
        userNewLike = false;
        userVoted = false;
        saveVote(5, this.state.id).done();
        this.sendUpdateRequest('downvote', '1');
    }
    this.setState({
      likecount: newLikeCount,
      userLiked: userNewLike,
      userDisliked: false,
      userHasVoted: userVoted,
    });
  }

  renderDownvote() {
    let newLikeCount = this.state.likecount;
    let userHasDisliked = true;
    let userVoted = true;
    if (!this.state.userHasVoted) {
      newLikeCount -= 1;
      saveVote(2, this.state.id).done();
      this.sendUpdateRequest('downvote', '1');
    } else if (this.state.userLiked) {
      newLikeCount -= 2;
      saveVote(3, this.state.id).done();
      this.sendUpdateRequest('downvote', '2');
    } else if (this.state.userDisliked) {
      newLikeCount += 1;
      userHasDisliked = false;
      userVoted = false;
      saveVote(6, this.state.id).done();
      this.sendUpdateRequest('upvote', 1);
    }
    this.setState({
      likecount: newLikeCount,
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
          restaurant={this.props.restaurant}
          pageStyle={restaurantPageStyle}
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
            <Image style={photoStyle} source={{ uri: this.state.link }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                <View style={{ flex: 2 }} />

                <Text style={{ color: voteCountColor, ...likeCountTextStyle }}>
                  {this.state.likecount.toString()}
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
            </Image>
          </View>
        </RestaurantModal>
      </View>
    );
  }
}

const styles = {
  photoFrameStyle: {
    borderRadius: 9,
    overflow: 'hidden'
  },
  photoStyle: { // The picture
    flex: 1,
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
  likeCountContainerStyle: { // Upvote arrow + number of likes container
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10
  },
  likeCountArrowStyle: { // the arrow next to number of likes
    height: 13,
    width: 13
  },
  likeCountTextStyle: { // Number of likes
    fontFamily: 'Avenir',
    fontSize: 18,
    textAlign: 'justify',
    fontWeight: 'bold',
    marginRight: 10,
    marginBottom: 10
  },
  likeContainerStyle: { // Upvote/downvote container
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
};

const {
  photoFrameStyle,
  photoStyle,
  restaurantPageStyle,
  photoInfoStyle,
  upvoteStyle,
  downvoteStyle,
  likeCountContainerStyle,
  likeCountArrowStyle,
  likeCountTextStyle,
  likeContainerStyle
} = styles;

function mapStateToProps({ loginState }) {
  return { loginState };
}

export default connect(mapStateToProps)(PhotoDetail);
