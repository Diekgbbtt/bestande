import React, {Component} from 'react';
import {Animated, Platform, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components';

const Wrapper = styled(View).attrs({
	pointerEvents: 'none',
})`
	flex: 1;
	justify-content: center;
	align-items: center;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 10;
`;

const Container = styled(Animated.View)`
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.7);
	height: 110px;
	width: 110px;
	border-radius: 4px;
`;

const Icon = styled(Image)`
	tint-color: white;
	width: 45px;
	height: 45px;
`;

const Label = styled(Text)`
	color: white;
	font-weight: bold;
	font-size: 12px;
	margin-top: 12px;
`;

export class Hud extends Component {
	animatedValue = new Animated.Value(0);
	state = {
		icon: require('../assets/check-hq.png'),
		label: 'Everyday',
	};

	setContent({icon, label}: {icon: NodeRequire; label: string}) {
		this.setState({
			icon,
			label,
		});
	}

	show() {
		Animated.timing(this.animatedValue, {
			toValue: 1,
			duration: 200,
			useNativeDriver: true,
		}).start();
		setTimeout(() => {
			Animated.timing(this.animatedValue, {
				toValue: 0,
				duration: 1000,
				useNativeDriver: true,
			}).start();
		}, 2000);
	}

	render() {
		if (Platform.OS === 'web') {
			return null;
		}

		return (
			<Wrapper>
				<Container
					style={{
						opacity: this.animatedValue,
					}}
				>
					<Icon source={this.state.icon} />
					<Label>{this.state.label}</Label>
				</Container>
			</Wrapper>
		);
	}
}
