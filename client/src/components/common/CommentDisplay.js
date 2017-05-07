import React from 'react';
import { Text, View } from 'react-native';

const CommentDisplay = (props) => (
  <View style={styles.containerStyle}>
    <Text style={styles.textStyle}>
      {props.text}
    </Text>
    {props.children}
  </View>
);

const styles = {
    containerStyle: {
      flex: -1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderRadius: 20,
      backgroundColor: '#ff9700',
      alignItems: 'center',
      padding: 8,
      margin: 5
    },
    textStyle: {
      color: 'white',
      fontFamily: 'Avenir',
      fontSize: 12,
      marginLeft: 3,
      marginRight: 3,
    }
};

export { CommentDisplay };
