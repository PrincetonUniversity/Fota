import React, { Component } from 'react';
import { Image, View } from 'react-native';

class Banner extends Component {
  render() {
    const { photo, containerStyle, photoStyle, children, onLoad } = this.props;
    if (photo) {
      return (
        <View style={containerStyle}>
          <Image
            source={{ uri: photo }}
            style={photoStyle}
            onLoad={onLoad}
          >
            {children}
          </Image>
        </View>
      );
    }
    return (
      <View style={{ backgroundColor: '#d3d3d3', ...containerStyle }}>
        {children}
      </View>
    );
  }
}

export { Banner };
