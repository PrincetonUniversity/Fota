import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';

const styles = {
  pageStyle: {
    flex: 1,
    flexDirection: 'column'
  },
  headerStyle: {
    height: 40,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20
  },
  imageStyle: {
    width: 300,
    height: 300
  }
};

const { pageStyle,
        headerStyle,
        imageStyle
      } = styles;

class UploadPage extends Component {
  deleteImage(photo) {
    RNFetchBlob.fs.exists(photo)
      .then((result) => {
        if (result) {
          return RNFetchBlob.fs.unlink(photo)
            .then(() => console.log('File deleted'))
            .catch((err) => console.log(err.message));
        }
      });
  }

  render() {
    if (this.props.photo) {
      // const uploadPhoto = require(this.props.photo);
      // console.log(uploadPhoto)
      return (
        <View style={pageStyle}>
          <View style={headerStyle}>
            <Text
              onPress={() => {
                this.deleteImage(this.props.photo);
                this.props.close();
              }}
            >
              Cancel
            </Text>
          </View>

          <Image
            source={{ uri: this.props.photo }}
            style={imageStyle}
          />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: 'blue' }} />
    );
  }
}

export default UploadPage;
