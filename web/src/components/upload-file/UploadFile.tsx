import React, {Component, useState} from 'react';
import styled from 'styled-components';
import DropzoneS3Uploader from 'react-dropzone-s3-uploader';
import {FixedDocumentData} from './types';
import {Institution} from '../../../../core/models/credit';
import {apiRequest} from '../../../../core/functions/api-request';
import {ExpandedPublicFileSharingDocument} from '../../../../core/types/file-sharing-document';

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
		return <Dropper>Datei auswählen</Dropper>;
	}
}

export const UploadFile: React.FC<{
	uni_identifier: string;
	university: Institution;
	onUpload: (file: ExpandedPublicFileSharingDocument) => void;
}> = (props) => {
	const {uni_identifier, university, onUpload} = props;
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);

	const renderProgress = () => {
		if (!uploading) {
			return null;
		}
		return <progress style={{width: '100%'}} value={progress / 100} />;
	};

	const showBanner = (message, type) => {
		const event = new CustomEvent('showBanner', {detail: {message, type}});
		window.dispatchEvent(event);
	};

	const checkFileSizeAndType = (file, next) => {
		const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB in bytes
		const allowedTypes = [
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'text/plain',
			'application/vnd.openxmlformats-officedocument.presentationml.presentation',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'application/vnd.ms-excel',
			'image/png',
			'image/jpeg',
		];

		if (!allowedTypes.includes(file.type)) {
			showBanner(
				'Invalid file type. Only PDF, DOC, DOCX, TXT, PPTX, XLSX, XLS, PNG, JPEG, and JPG are allowed.',
				'error'
			);
			setUploading(false);
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			showBanner('File size exceeds the 50 MB limit', 'error');
			setUploading(false);
			return;
		}

		setProgress(0);
		setUploading(true);
		next(file);
	};

	return (
		<Wrapper>
			<DropzoneS3Uploader
				s3Url="https://bestande.fra1.digitaloceanspaces.com"
				upload={{
					signingUrl: '/s3/sign',
					signingUrlMethod: 'GET',
					accept: 'image/*,.pdf',
					preprocess: checkFileSizeAndType,
				}}
				style={{
					visibility: 'visible',
					width: '100%',
				}}
				onProgress={(progress) => setProgress(progress)}
				onError={(err: Error) => console.error(err)}
				onFinish={async (file) => {
					const document: FixedDocumentData = {
						fileSize: Number(file.file.size),
						mimeType: file.file.type,
						s3Key: file.fileKey,
						uni_identifier,
						university,
					};
					const data: {
						document: ExpandedPublicFileSharingDocument;
					} = await apiRequest('/documents', {
						method: 'PUT',
						body: JSON.stringify({
							...document,
							fileName: file.file.name,
							sendToChat: false,
						}),
					});
					onUpload(data.document);
					setUploading(false);
				}}
			>
				<UploadDisplay />
			</DropzoneS3Uploader>
			{renderProgress()}
		</Wrapper>
	);
};
