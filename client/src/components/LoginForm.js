import React, { Component } from 'react';
import { Text, View } from 'react-native';
import firebase from 'firebase';
import { CardSection, Button, Input, Spinner } from './common';

class LoginForm extends Component {
	state = { email: '', pass: '', error: '', loading: false };

	onButtonPress() {
		const { email, pass } = this.state;

		this.setState({ error: '', loading: true });

		firebase.auth().signInWithEmailAndPassword(email, pass)
			.then(this.onLoginSuccess.bind(this))
			.catch(() => {
				firebase.auth().createUserWithEmailAndPassword(email, pass)
					.then(this.onLoginSuccess.bind(this))
					.catch(this.onLoginFail.bind(this));
			});
	}

	onLoginSuccess() {
		this.setState({ email: '', pass: '', loading: false });
	}

	onLoginFail() {
		this.setState({ error: 'Authentication Failed.', loading: false });
	}

	renderButton() {
		if (this.state.loading) {
			return <Spinner size="small" />;
		}
		return (
			<Button onPress={this.onButtonPress.bind(this)}>
				Log in
			</Button>
		);
	}

	render() {
		return (
			<View>
				<CardSection>
					<Input
						placeholder='user@example.com'
						value={this.state.email}
						onChangeText={email => this.setState({ email })}
					>
            <Text style={styles.labelStyle}>Email</Text>
          </Input>
				</CardSection>
				<CardSection>
					<Input
						placeholder='password'
						value={this.state.pass}
						onChangeText={pass => this.setState({ pass })}
						secure
					>
            <Text style={styles.labelStyle}>Password</Text>
          </Input>
				</CardSection>

				<Text style={styles.errorTextStyle}>
					{this.state.error}
				</Text>

				<CardSection>
					{this.renderButton()}
				</CardSection>
			</View>
		);
	}
}

const styles = {
  labelStyle: {
    flex: 0.35
  },
	errorTextStyle: {
		fontSize: 20,
		alignSelf: 'center',
		color: 'red'
	}
};

export default LoginForm;
