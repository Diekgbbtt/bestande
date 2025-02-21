import React, {Component} from 'react';
import {Animated, Easing, View} from 'react-native';
import {Path, PathProps, Svg} from 'react-native-svg';
import {Colors} from '../../../../core/functions/Colors';
import {bottom, top} from './paths';

export default class Lines extends Component<
	{},
	{
		progress: Animated.Value;
	}
> {
	path: React.Component<PathProps, any, any>;
	path2: React.Component<PathProps, any, any>;
	state = {
		progress: new Animated.Value(0),
	};

	timing = Animated.loop(
		Animated.timing(this.state.progress, {
			toValue: 100,
			duration: 1000,
			easing: Easing.linear,
			useNativeDriver: true,
		})
	);

	componentDidMount() {
		let i = 0;
		this.state.progress.addListener(() => {
			i++;
			if (this.path) {
				// @ts-expect-error
				this.path.setNativeProps({
					strokeDashoffset: Math.floor(i % 386),
				});
			}

			if (this.path2) {
				// @ts-expect-error
				this.path2.setNativeProps({
					strokeDashoffset: Math.floor(i % 276),
				});
			}
		});
		setTimeout(() => {
			this.timing.start();
		}, 200);
	}

	render() {
		return (
			<View>
				<Svg width="100" height="100">
					<Path
						ref={(path2) => {
							this.path2 = path2 as React.Component<PathProps, any, any>;
						}}
						strokeWidth={4}
						stroke={Colors.Red}
						fill="none"
						scale="0.5"
						strokeDasharray={138}
						strokeLinecap="butt"
						d={top}
					/>
					<Path
						ref={(path) => {
							this.path = path as React.Component<PathProps, any, any>;
						}}
						strokeWidth={4}
						stroke={Colors.Red}
						fill="none"
						scale="0.5"
						strokeDasharray={193}
						strokeLinecap="butt"
						d={bottom}
					/>
					<Path
						strokeWidth={4}
						stroke="rgba(0, 0, 0, 0.1)"
						fill="none"
						scale="0.5"
						d={top}
					/>
					<Path
						strokeWidth={4}
						stroke="rgba(0, 0, 0, 0.1)"
						fill="none"
						scale="0.5"
						d={bottom}
					/>
				</Svg>
			</View>
		);
	}
}
