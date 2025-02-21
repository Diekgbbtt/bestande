import React, {Component} from 'react';
import {Dimensions, View} from 'react-native';
import {Image} from 'react-native-normalized';
import styled from 'styled-components';
import {getImageUrl} from '../../../core/functions/get-image-url';
import {ImageType} from '../../../core/types/image';

const HEIGHT = 150;

const Container = styled(View)<{
	width?: number;
	show?: boolean;
	height?: number;
}>`
	width: ${(props) => props.width || 0}px;
	height: ${(props) => (props.show ? props.height : 0)}px;
`;

const {width} = Dimensions.get('window');

type Props = {
	height?: number;
	inset?: number;
	image?: ImageType;
};

export class HeaderImage extends Component<Props> {
	width: number;
	preciseWidth: number;
	height: number;
	constructor(props: Props) {
		super(props);
		this.width = Math.round(width / 100 - (props.inset || 0)) * 100;
		this.preciseWidth = width - (props.inset || 0);
		this.height = props.height ? props.height : HEIGHT;
	}

	state = {
		loaded: false,
	};

	renderPlaceHolder() {
		if (this.state.loaded) {
			return null;
		}

		return <Container show height={this.height} width={this.preciseWidth} />;
	}

	render() {
		if (!this.props.image) {
			return null;
		}

		return (
			<View>
				{this.renderPlaceHolder()}
				<Container
					width={this.preciseWidth}
					show={this.state.loaded}
					height={this.height}
				>
					<Image
						onLoad={() => this.setState({loaded: true})}
						source={{
							uri: getImageUrl({
								height: this.height * 2,
								width: this.width * 2,
								cdn_identifier: this.props.image.cdn_identifier,
								crop: null,
							}),
						}}
						style={{
							height: this.height,
							width: this.preciseWidth,
						}}
					/>
				</Container>
			</View>
		);
	}
}
