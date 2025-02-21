import {Donut} from '@jonny/rebass';
import React, {Component} from 'react';
import DropzoneS3Uploader from 'react-dropzone-s3-uploader';
import styled from 'styled-components';
import {ImageType} from '../../../core/types/image';
import {HeaderImage} from './header-image';
import {EscapePadded} from './layout/padded';

const Wrapper = styled.div`
	align-items: center;
`;

const Dropper = styled.div`
	display: block;
	border: 2px dashed rgba(0, 0, 0, 0.1);
	width: 100%;
	height: 150px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: gray;
	font-size: 0.9em;
	font-weight: bold;
	cursor: pointer;
	&:hover {
		border-color: rgba(0, 0, 0, 0.2);
	}
`;

class UploadDisplay extends Component {
	render() {
		return <Dropper>Bild auswählen</Dropper>;
	}
}

class Uploader extends Component<{
	onUploaded: (file: {filename: string}) => void;
	image: ImageType;
}> {
	state = {
		progress: 0,
		uploading: false,
	};

	onUploadStart(file, next) {
		this.setState({
			progress: 0,
			uploading: true,
		});
		next(file);
	}

	handleProgress(progress) {
		this.setState({
			progress,
		});
	}

	handleError(err: Error) {
		// eslint-disable-next-line no-alert
		window.alert('Fehler: ' + err.message);
	}

	handleFinish(file) {
		this.setState({
			progress: 0,
			uploading: false,
		});
		this.props.onUploaded(file);
	}

	renderProgress() {
		if (!this.state.uploading) {
			return null;
		}

		return (
			<Donut
				value={this.state.progress / 100}
				strokeWidth={10}
				size={50}
				color="blue"
			/>
		);
	}

	render() {
		return (
			<Wrapper>
				{this.props.image?.cdn_identifier ? (
					<EscapePadded horizontal>
						<HeaderImage image={this.props.image} />
					</EscapePadded>
				) : (
					<DropzoneS3Uploader
						s3Url="https://bestande.s3.eu-central-1.amazonaws.com"
						upload={{
							signingUrl: '/s3/sign',
							signingUrlMethod: 'GET',
							accept: 'image/*',
							preprocess: (file, next) => this.onUploadStart(file, next),
						}}
						style={{
							visibility: this.state.uploading ? 'hidden' : 'visible',
							width: '100%',
						}}
						onProgress={(progress) => this.handleProgress(progress)}
						onError={(err: Error) => this.handleError(err)}
						onFinish={(file) => this.handleFinish(file)}
					>
						<UploadDisplay />
					</DropzoneS3Uploader>
				)}
				{this.renderProgress()}
			</Wrapper>
		);
	}
}

export default Uploader;
