import React from 'react';
import { View, Image, Text } from 'react-native';
import { Card, CardSection, ImageButton } from './common';

const PhotoDetail = ({ photo }) => {
    const { link, likecount } = photo;
    const { photoStyle,
            voteStyle,
            likeCountContainerStyle,
            likeCountArrowStyle,
            likeCountTextStyle,
            likeContainerStyle
         } = styles;
    var userLikes = false;
    return (
        <Card>
            <CardSection>
                <ImageButton
                    style={photoStyle}
                    source={{ uri: link }}
                    onPress={() => console.log('pressed')}
                />
            </CardSection>

            <CardSection>
                <View style={likeCountContainerStyle}>
                    <Image
                        source={require('../img/upvote_activated.png')}
                        style={likeCountArrowStyle}
                    />
                    <Text style={likeCountTextStyle}>{likecount}</Text>
                </View>

                <View style={likeContainerStyle}>
                    <ImageButton
                        source={require('../img/upvote_unactivated.png')}
                        style={voteStyle}
                        onPress={() => { userLikes = true; }}
                    />
                    <ImageButton
                        source={require('../img/downvote_unactivated.png')}
                        style={voteStyle}
                        onPress={() => { userLikes = true; }}
                    />
                </View>
            </CardSection>
        </Card>
    );
};

const styles = {
    photoStyle: { // The picture
        height: 300,
        flex: 1,
        width: null
    },
    voteStyle: { // Upvote/downvote
        height: 25,
        width: 25
    },
    likeCountContainerStyle: { // Upvote arrow + number of likes container
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 10
    },
    likeCountArrowStyle: { // the arrow next to number of likes
        height: 15,
        width: 15
    },
    likeCountTextStyle: { // Number of likes
        fontSize: 15,
        textAlign: 'justify',
        fontWeight: 'bold',
        marginLeft: 5
    },
    likeContainerStyle: { // Upvote/downvote container
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        marginRight: 10
    },
};

export default PhotoDetail;
