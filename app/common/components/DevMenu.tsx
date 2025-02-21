import React, {Component} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import Lines from './loaders/Lines';

export class DevMenu extends Component {
	render() {
		return (
			<View>
				<Lines />
				{/*
				// @ts-expect-error */}
				<Text>Hermes: {String(global.HermesInternal !== null)}</Text>
			</View>
		);
	}
}
