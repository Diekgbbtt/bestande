import React, {Component} from 'react';
import windowSize from 'react-window-size';
import styled from 'styled-components';
import {getImageUrl} from '../../../core/functions/get-image-url';
import {ImageType} from '../../../core/types/image';

const HEIGHT = 250;
const AVATAR_HEIGHT = 45;

const BaseContainer = styled.div`
	position: relative;
	background: rgba(0, 0, 0, 0.1);
`;

const AvatarContainer = styled(BaseContainer)`
	width: ${AVATAR_HEIGHT}px;
	height: ${AVATAR_HEIGHT}px;
	border-radius: 50%;
`;

const Container = styled(BaseContainer)<{
	height?: number;
}>`
	width: 100%;
	height: ${(props) => (props.height ? props.height : HEIGHT)}px;
	display: flex;
	justify-content: center;
`;

const Img = styled.img<{
	loading?: boolean;
	error?: boolean;
}>`
	width: 100%;
	height: ${HEIGHT}px;
	object-fit: cover;
	position: absolute;
	background: ${(props) =>
		props.loading
			? 'rgba(0, 0, 0, 0.05)'
			: props.error
			? 'rgba(255, 0, 0, 0.05)'
			: 'transparent'};
`;

const AvatarImage = styled(Img)`
	height: 100%;
	border-radius: 50%;
`;

const CannotBeLoaded = styled.div`
	align-self: center;
	text-align: center;
`;

type Props = {
	type: 'avatar' | string;
	windowWidth: number;
	image: ImageType;
	height?: number;
};

class HeaderImageComp extends Component<Props> {
	state = {
		loading: true,
		error: false,
	};

	componentDidUpdate(prevProps: Props) {
		if (!this.props.image) {
			return;
		}

		if (this.getUrl(this.props.image) !== this.getUrl(prevProps.image)) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.setState({
				loading: true,
				error: false,
			});
		}
	}

	getWidth() {
		switch (this.props.type) {
			case 'avatar':
				return AVATAR_HEIGHT;
			default:
				return Math.round(((this.props.windowWidth ?? 1200) * 0.8) / 100) * 100;
		}
	}

	getHeight() {
		if (this.props.height) {
			return this.props.height;
		}

		switch (this.props.type) {
			case 'avatar':
				return AVATAR_HEIGHT;
			default:
				return HEIGHT;
		}
	}

	getUrl(image: ImageType) {
		const pixelRatio =
			typeof window === 'undefined' ? 2 : window.devicePixelRatio;
		return getImageUrl({
			cdn_identifier: image.cdn_identifier,
			height: this.getHeight() * pixelRatio,
			width: this.getWidth() * pixelRatio,
			crop: null,
		});
	}

	render() {
		const SelectedContainer =
			this.props.type === 'avatar' ? AvatarContainer : Container;
		const SelectedImage = this.props.type === 'avatar' ? AvatarImage : Img;
		return (
			<SelectedContainer>
				{this.props.image ? (
					<SelectedImage
						src={this.getUrl(this.props.image)}
						alt={
							this.state.error
								? 'Bild konnte nicht geladen werden'
								: this.props.image.alt_text
						}
						title={this.props.image.alt_text}
						error={this.state.error}
						// @ts-expect-error
						loading={this.state.loading}
						style={{
							visibility: this.state.error ? 'hidden' : 'visible',
						}}
						onLoad={() => {
							this.setState({
								error: false,
								loading: false,
							});
						}}
						onError={() => {
							this.setState({
								error: true,
								loading: false,
							});
						}}
					/>
				) : null}
				{this.props.image ? (
					this.state.error ? (
						<CannotBeLoaded>
							{this.props.image.cdn_identifier
								? `Bild ${this.props.image.cdn_identifier} kann nicht geladen werden`
								: 'Kein Bild ausgewählt'}
						</CannotBeLoaded>
					) : null
				) : null}
			</SelectedContainer>
		);
	}
}

export const HeaderImage =
	typeof window === 'undefined' ? HeaderImageComp : windowSize(HeaderImageComp);
