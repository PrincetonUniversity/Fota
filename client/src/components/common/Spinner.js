/******************************************************************************
 * Called by: Account/LoginForm, Camera/CameraCommentsPage, Photo/PhotoList
 * Dependencies:
 *
 * Description: Visual component indicating that some content is loading.
 *
 ******************************************************************************/

import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const Spinner = ({ size }) => (
	<View style={styles.spinnerStyle}>
		<ActivityIndicator size={size || 'large'} color='#ff9700' />
	</View>
);

const styles = {
	spinnerStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
};

export { Spinner };
