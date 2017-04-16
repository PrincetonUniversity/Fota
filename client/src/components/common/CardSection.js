import React from 'react';
import { View } from 'react-native';

const CardSection = (props) => {
    return (
        <View style={styles.containerStyle}>
            {props.children}
        </View>
    );
};

const styles = {
    containerStyle: {
        padding: 10,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        flexDirection: 'row',
        position: 'relative'
    }
};
export { CardSection };
