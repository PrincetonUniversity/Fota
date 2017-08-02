import React, { Component } from 'react';
import {
  View, Animated, PanResponder, Image,
  Dimensions, LayoutAnimation, UIManager
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class PhotoGallery extends Component {
  static defaultProps = {
    initialIndex: 0
  }

  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dy > SWIPE_THRESHOLD) {
          this.forceSwipe('down');
        } else if (gesture.dy < -SWIPE_THRESHOLD) {
          this.forceSwipe('up');
        }
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe('left');
        } else {
          this.resetPosition();
        }
      }
    });

    this.state = {
      panResponder,
      position,
      index: this.props.initialIndex
    };
  }

  componentWillMount() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true); // For Android
    LayoutAnimation.spring();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props.data) {
      this.setState({ index: nextProps.initialIndex });
    }
  }

  onSwipeLeft() {
    this.setState({ index: this.state.index + 1 });
  }

  onSwipeRight() {
    console.log('stupid');
    this.setState({ index: this.state.index - 1 });
  }

  onSwipeComplete(direction) {
    if (direction === 'up' || direction === 'down') {
      this.props.onSwipeVertical();
    } else {
      direction === 'right' ? this.onSwipeRight() : this.onSwipeLeft();
      this.state.position.setValue({ x: 0, y: 0 });
    }
  }

  getCardStyle() {
    const { position } = this.state;
    return position.getLayout();
  }

  forceSwipe(direction) {
    if (this.state.index === 0 && direction === 'right') {
      this.resetPosition();
    } else if (this.state.index === this.props.data.length - 1 && direction === 'left') {
      this.resetPosition();
    } else {
      if (direction === 'up' || direction === 'down') {
        const y = direction === 'down' ? SCREEN_HEIGHT : -SCREEN_HEIGHT;
        Animated.timing(this.state.position, {
          toValue: { x: 0, y },
          duration: SWIPE_OUT_DURATION
        }).start(() => this.onSwipeComplete(direction));
      } else {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(this.state.position, {
          toValue: { x, y: 0 },
          duration: SWIPE_OUT_DURATION
        }).start(() => this.onSwipeComplete(direction));
      }
    }
  }

  resetPosition() {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  renderCard() {
    const currentPhoto = this.props.data[this.state.index];
    return (
      <Animated.View
        key={currentPhoto.id}
        style={this.getCardStyle()}
        {...this.state.panResponder.panHandlers}
      >
        <Image
          source={{ uri: currentPhoto.link }}
          style={{ height: 200, width: 200 }}
        />
      </Animated.View>
    );
  }

  render() {
    return (
      <View style={styles.modalStyle}>
        {this.renderCard()}
      </View>
    );
  }
}

const styles = {
  modalStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  }
};

export { PhotoGallery };
