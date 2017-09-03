import React, { Component } from 'react';
import { View, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Pages } from 'react-native-pages';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
// const SWIPE_THRESHOLD = SCREEN_HEIGHT / 4;
// const SWIPE_OUT_DURATION = 250;

class PhotoGallery extends Component {
  static defaultProps = {
    initialIndex: 0
  }

  constructor(props) {
    super(props);
    // const position = new Animated.ValueXY();
    // const panResponder = PanResponder.create({
    //   onStartShouldSetPanResponder: () => true,
    //   onPanResponderMove: (event, gesture) => {
    //     position.setValue({ y: gesture.dy });
    //   },
    //   onPanResponderRelease: (event, gesture) => {
    //     if (gesture.dy > SWIPE_THRESHOLD) {
    //       this.forceSwipe('down');
    //     } else if (gesture.dy < -SWIPE_THRESHOLD) {
    //       this.forceSwipe('up');
    //     } else {
    //       this.resetPosition();
    //     }
    //   },
    //   onPanResponderTerminationRequest: (event, gesture) => {}
    // });

    this.state = {
      //panResponder,
      //position,
      index: this.props.initialIndex
    };
  }

  // componentWillMount() {
    // UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true); // For Android
    // LayoutAnimation.spring();
  // }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.photos !== this.props.photos) {
  //     this.setState({ index: nextProps.initialIndex });
  //   }
  // }

  // onSwipeComplete(direction) {
  //   if (direction === 'up' || direction === 'down') {
  //     this.props.onSwipeVertical();
  //     this.state.position.setValue({ x: 0, y: 0 });
  //   }
  //   // else {
  //   //   direction === 'right' ? this.onSwipeRight() : this.onSwipeLeft();
  //   //   this.state.position.setValue({ x: 0, y: 0 });
  //   // }
  // }

  // getCardStyle() {
  //   const { position } = this.state;
  //   return position.getLayout();
  // }

  // forceSwipe(direction) {
  //   const y = direction === 'down' ? SCREEN_HEIGHT : -SCREEN_HEIGHT;
  //   Animated.timing(this.state.position, {
  //     toValue: { x: 0, y },
  //     duration: SWIPE_OUT_DURATION
  //   }).start(() => this.onSwipeComplete(direction));
  // }

  // resetPosition() {
  //   Animated.spring(this.state.position, {
  //     toValue: { x: 0, y: 0 }
  //   }).start();
  // }

  renderPhotos() {
    return this.props.photos.map((photo, index) =>
        // <ScrollView
        //   key={index}
        //   maximumZoomScale={3.0}
        //   bouncesZoom={false}
        //   pagingEnabled
        //   contentOffset={{ y: SCREEN_HEIGHT }}
        //   onMomentumScrollEnd={e => {
        //     const diffY = e.nativeEvent.contentOffset.y;
        //     if (diffY >= SWIPE_THRESHOLD * 2 || diffY <= 0) {
        //       this.props.onSwipeVertical();
        //     }
        //   }}
        // >
        // <Animated.View
        //   key={index}
        //   style={this.getCardStyle()}
        //   {...this.state.panResponder.panHandlers}
        // >
        /* <View style={styles.spacerStyle} /> */
        <TouchableOpacity
          key={index}
          activeOpacity={1}
          onPress={this.props.closeModal}
          style={{ flex: 1 }}
        >
          <View style={styles.photoFrameStyle}>
            <Image
              source={{ uri: photo }}
              style={styles.photoStyle}
            />
          </View>
        </TouchableOpacity>

          /* <View style={styles.spacerStyle} /> */
        // </Animated.View>
      //</ScrollView>
    );
  }

  render() {
    return (
        // <ScrollView keyboardShouldPersistTaps='always' horizontal pagingEnabled>
        <Pages startPage={this.props.initialIndex} indicatorPosition={'none'}>
          {this.renderPhotos()}
        </Pages>
        // </ScrollView>
    );
  }
}

const styles = {
  modalStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  spacerStyle: {
    //backgroundColor: 'red'
  },
  photoFrameStyle: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  photoStyle: {
    height: 300,
    width: 300,
    backgroundColor: '#d3d3d3',
    borderRadius: 8
  }
};

export { PhotoGallery };
