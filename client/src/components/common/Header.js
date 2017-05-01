import React from 'react';
import { View, Platform } from 'react-native';

const Header = (props) => (
      <View style={styles.viewStyle}>
        {props.children}
      </View>
  );

const styles = {
    viewStyle: {
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        marginTop: (Platform.OS === 'ios') ? 15 : 0,
        paddingHorizontal: 10,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.2,
        // elevation: 2,
        position: 'relative',
        flexDirection: 'row'
    },
};

export { Header };
