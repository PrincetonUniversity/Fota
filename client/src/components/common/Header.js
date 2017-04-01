import React from 'react';
import { View } from 'react-native';

const Header = (props) => (
      <View style={styles.viewStyle}>
        {props.children}
      </View>
  );

const styles = {
    viewStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 60,
        paddingTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
        position: 'relative',
        flexDirection: 'row'
    },
};

export { Header };
