import React from 'react';
import { View, Image } from 'react-native';
import { Card, CardSection, ImageButton } from './common';

const PhotoDetail = ({ photo }) => {
    const { link, likeCount } = photo;
    const { photoStyle,
            heartStyle,
            heartContainerStyle,
            logoStyle,
            logoContainerStyle,
            cardStyle } = styles;
    var userLikes = false;
    console.log(userLikes);
    return (
        <Card>
            <CardSection>
                <Image
                    style={photoStyle}
                    source={{ uri: link }}
                />
            </CardSection>

            <CardSection style={cardStyle}>
                <View style={heartContainerStyle}>
                    <ImageButton
                        source={require('../img/upvote.jpg')}
                        style={heartStyle}
                        onPress={() => { userLikes = true; }}
                    />
                </View>
                <View style={logoContainerStyle}>
                    <ImageButton
                        source={require('../img/downvote.jpg')}
                        style={logoStyle}
                        onPress={() => { userLikes = true; }}
                    />
                </View>
            </CardSection>
        </Card>
    );
};

const styles = {
    photoStyle: {
        height: 300,
        flex: 1,
        width: null
    },
    heartStyle: {
        height: 30,
        width: 30
    },
    logoStyle: {
        height: 30,
        width: 30
    },
    heartContainerStyle: {
        alignItems: 'center'
    },
    logoContainerStyle: {
        alignItems: 'center',
        marginRight: 10
    },
};

export default PhotoDetail;
