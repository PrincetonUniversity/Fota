import React, { Component } from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';

class Timer extends Component {
  state = { timer: null, counter: 0 }

  componentWillMount() {
    const timer = setInterval(this.tick.bind(this), 1000);
    this.setState({ timer });
    console.log(this.props);
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  tick() {
    this.setState({ counter: this.state.counter + 1000 });
  }

  render() {
    //console.log(this.state.secondsLeft);
    const temp = moment.utc(Math.max(this.props.totalTime - this.state.counter, 0)).format('HH:mm:ss');
    //console.log(temp);
    return (
      <View style={timerStyle}>
        <Text style={{ fontSize: 25, fontWeight: '900', color: '#ff7f00' }}>
          {temp}
        </Text>
      </View>
    );
  }
}

const styles = {
  timerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ff7f00',
    width: 240,
    height: 50,
    borderWidth: 3,
    borderRadius: 11,
    shadowOpacity: 0.1,
    marginBottom: 25,
    shadowOffset: { width: 0, height: 15 },
    shadowRadius: 3
  }
};

const {
  timerStyle
} = styles;

export { Timer };
