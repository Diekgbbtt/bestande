import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

const styles = StyleSheet.create({
	map: StyleSheet.absoluteFillObject,
});

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
		this.state = {
			region: {
				...this.region,
			},
		};
	}

	render() {
		const {latitude, longitude, title, height = 200} = this.props;
		return (
			<View>
				<View style={{height}}>
					<MapView
						style={styles.map}
						initialRegion={this.region}
						onRegionChangeComplete={(region) => {
							this.setState({region});
						}}
						region={this.state.region}
					>
						<Marker
							title={title}
							coordinate={{
								latitude,
								longitude,
							}}
						/>
					</MapView>
				</View>
			</View>
		);
	}
}
