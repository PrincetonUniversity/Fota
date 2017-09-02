import React, { Component } from 'react';
import { Image, View } from 'react-native';

class Banner extends Component {
  render() {
    const { photo, containerStyle, photoStyle, children } = this.props;
    if (photo) {
      return (
        <View style={containerStyle}>
          <Image
            source={{ uri: photo }}
            style={photoStyle}
          >
            {children}
          </Image>
        </View>
      );
    }
    return (
      <View style={{ backgroundColor: '#7f87b2', ...containerStyle }}>
        {children}
      </View>
    );
  }
}

export { Banner };
