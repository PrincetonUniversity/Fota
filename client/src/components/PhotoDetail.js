import React from 'react';
import { View, Image, Text } from 'react-native';
import { Card, CardSection, ImageButton } from './common';

const PhotoDetail = ({ photo }) => {
    const { link, likecount } = photo;
    const { photoStyle,
            voteStyle,
            likeCountContainerStyle,
            likeContainerStyle
         } = styles;
    var userLikes = false;
    console.log(likecount);
    return (
        <Card>
            <CardSection>
                <Image
                    style={photoStyle}
                    source={{ uri: link }}
                />
            </CardSection>

            <CardSection>
                <View style={likeCountContainerStyle}>
                    <Image
                        source={require('../img/upvote.jpg')}
                        style={voteStyle}
                    />
                    <Text>{likecount}</Text>
                </View>

                <View style={likeContainerStyle}>
                    <ImageButton
                        source={require('../img/upvote.jpg')}
                        style={voteStyle}
                        onPress={() => { userLikes = true; }}
                    />
                    <ImageButton
                        source={require('../img/downvote.jpg')}
                        style={voteStyle}
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
    voteStyle: {
        height: 30,
        width: 30
    },
    likeCountContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    likeContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: 10
    },
};

export default PhotoDetail;
