import React, { Component } from 'react';
import { View, Navigator } from 'react-native';
import CameraPage from './CameraPage';
import UploadLocationPage from './UploadLocationPage';
import UploadCommentsPage from './UploadCommentsPage';

class CameraNavigator extends Component {
  renderScene(route, navigator) {
    switch (route.id) {
      case 0:
        return <CameraPage navigator={navigator} />;
      case 1:
        return <UploadLocationPage navigator={navigator} />;
      case 2:
        return <UploadCommentsPage navigator={navigator} />;
      default:
        return <CameraPage navigator={navigator} />;
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Navigator
          style={{ flex: 1, backgroundColor: '#fff' }}
          initialRoute={{ id: 0 }}
          renderScene={this.renderScene.bind(this)}
        />
      </View>
    );
  }
}

export default CameraNavigator;
