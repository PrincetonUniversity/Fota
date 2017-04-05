import React from 'react';
import { View, Text, TextInput } from 'react-native';

const Input = ({ label, placeholder, secure, value, onChangeText }) => {
	const { inputStyle, labelStyle, containerStyle } = styles;

	return (
		<View style={containerStyle}>
			<Text style={labelStyle}>{label}</Text>
			<TextInput
				style={inputStyle}
				value={value}
				placeholder={placeholder}
				onChangeText={onChangeText}
				autoCorrect={false}
				secureTextEntry={secure}
				underlineColorAndroid={'transparent'}
			/>
		</View>
	);
};

const styles = {
	inputStyle: {
		padding: 1,
		borderRadius: 3,
		color: '#000',
		paddingRight: 5,
		paddingLeft: 5,
		fontSize: 16,
		flex: 1
	},
	labelStyle: {
		color: '#000',
		fontSize: 18,
		paddingRight: 5
	},
	containerStyle: {
		backgroundColor: '#ddd',
		marginHorizontal: 10,
		paddingHorizontal: 12,
		borderRadius: 16,
		height: 32,
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	}
};

export { Input };
