import React, {Component} from 'react';
import {Animated} from 'react-native';

const duration = 200;

type Props = {
	text: string;
	duration?: number;
	style?: any;
};

export class FontWithTransition extends Component<Props> {
	state = {
		animation: new Animated.Value(1),
		text: this.props.text,
	};

	timeout: number | NodeJS.Timeout | null = null;
	componentDidUpdate(prevProps: Props) {
		if (this.props.text !== prevProps.text) {
			if (!this.state.animation) {
				return;
			}

			this.timeout = setTimeout(() => {
				this.setState({text: this.props.text});
				this.state.animation.setValue(0);
				Animated.timing(this.state.animation, {
					toValue: 1,
					duration: this.props.duration || duration,
					useNativeDriver: true,
				}).start();
				this.timeout = null;
			}, this.props.duration || duration);
			this.state.animation.setValue(1);
			Animated.timing(this.state.animation, {
				toValue: 0,
				duration: this.props.duration || duration,
				useNativeDriver: true,
			}).start();
		}
	}

	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout as number);
		}
	}

	render() {
		const {style, ...otherProps} = this.props;
		return (
			<Animated.Text
				numberOfLines={1}
				style={[style, {opacity: this.state.animation}]}
				{...otherProps}
			>
				{this.state.text}
			</Animated.Text>
		);
	}
}
