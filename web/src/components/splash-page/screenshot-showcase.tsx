import React, {Component} from 'react';
import styled from 'styled-components';
import {mobile} from '../../../../core/components/layout/responsive';

const Phone = styled.div`
	position: absolute;
	margin-top: -40px;
	left: 0;
	${mobile`
		margin-left: -160px;
	`}
`;

const Frame = styled.img`
	width: 310px;
	position: absolute;
`;

const Screens = styled.div`
	width: 251px;
	left: 30px;
	height: 700px;
	overflow: hidden;
	position: absolute;
`;

const Screen = styled.img<{
	current: number;
	position: number;
}>`
	position: absolute;
	width: 251px;
	transition: transform 0.3s;
	transform: translateX(${(props) => 0 - props.current * 251}px);
	left: ${(props) => (props.position - 1) * 251}px;
	top: 39px;
`;

class Slider extends Component<
	{
		right?: boolean;
	},
	{
		current: number;
	}
> {
	interval: NodeJS.Timeout | number;
	state = {
		current: 0,
	};

	componentDidMount() {
		this.interval = setInterval(() => {
			this.setState((prevState) => ({
				current: (prevState.current + 1) % 6,
			}));
		}, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.interval as number);
	}

	render() {
		return (
			<Phone>
				<Screens>
					{[1, 2, 3, 4, 5, 6, 7].map((i) => {
						return (
							<Screen
								key={i}
								current={this.state.current}
								position={i}
								src={`/static/screens/x-${i}.png`}
							/>
						);
					})}
				</Screens>
				<Frame src={'/static/iphone-x.png'} />
			</Phone>
		);
	}
}

export default Slider;
