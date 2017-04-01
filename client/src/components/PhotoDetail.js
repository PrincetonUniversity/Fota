import React from 'react';
import { View, Image } from 'react-native';
import { Card, CardSection, Button } from './common';

const PhotoDetail = ({ photo }) => {
    // const { image } = photo;
    const { link, likeCount } = photo;
    const { photoStyle } = styles;
    var userLikes = false;
    return (
        <Card>
            <CardSection>
                <Image
                    style={photoStyle}
                    source={{ uri: link }}
                />
            </CardSection>

            <CardSection>
                <Button onPress={() => { userLikes = true; }} >
                    Hot Dog!
                </Button>
            </CardSection>
        </Card>
    );
};

const styles = {
    photoStyle: {
        height: 300,
        flex: 1,
        width: null
        // width: 300
    }
};

export default PhotoDetail;
