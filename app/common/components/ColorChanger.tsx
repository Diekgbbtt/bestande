import React, {Component} from 'react';
import {Animated} from 'react-native';

export class ColorChangingView extends Component<{
	duration?: number;
	text?: boolean;
	image?: boolean;
	from: string;
	to: string;
	style?: any;
}> {
	animatedValue = new Animated.Value(0);
	componentDidMount() {
		Animated.timing(this.animatedValue, {
			toValue: 100,
			duration: this.props.duration || 200,
			// MUSt be false, background color and tint color are not supported!
			useNativeDriver: false,
		}).start();
	}

	getElement() {
		if (this.props.text) {
			return Animated.Text;
		}

		if (this.props.image) {
			return Animated.Image;
		}

		return Animated.View;
	}

	getProperty() {
		if (this.props.text) {
			return 'color';
		}

		if (this.props.image) {
			return 'tintColor';
		}

		return 'backgroundColor';
	}

	render() {
		const interpolateColor = this.animatedValue.interpolate({
			inputRange: [0, 100],
			outputRange: [this.props.from, this.props.to],
		});
		const {style = {}, ...props} = this.props;
		const Element = this.getElement();
		return (
			// @ts-expect-error
			<Element
				{...props}
				style={[style, {[this.getProperty()]: interpolateColor}]}
			/>
		);
	}
}
