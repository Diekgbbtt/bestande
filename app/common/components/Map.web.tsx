import React, {Component} from 'react';
import {View} from 'react-native';

type Props = {
	latitude: number;
	longitude: number;
	title: string;
	height?: number;
};

type Region = {
	latitude: number;
	longitude: number;
	latitudeDelta: number;
	longitudeDelta: number;
};

// ts-unused-exports:disable-next-line
export class Map extends Component<Props> {
	region: Region;
	state: {
		region: Region;
	};

	constructor(props: Props) {
		super(props);
		const {latitude, longitude} = props;
		this.region = {
			latitude,
			longitude,
			latitudeDelta: 0.0122,
			longitudeDelta: 0.0121,
		};
		// eslint-disable-next-line react/state-in-constructor
	}

	render() {
		return <View />;
	}
}
