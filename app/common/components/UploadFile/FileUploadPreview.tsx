import prettyBytes from 'pretty-bytes';
import React, {useMemo} from 'react';
import {TouchableOpacity, useWindowDimensions, View} from 'react-native';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components';
import {FileThumbnail} from '../../../../core/components/FileThumbnail';
import {Flexer} from '../../../../core/components/Primitives';
import {CircularProgress} from '../CircularProgress';
import {FixedDocumentData} from './types';

const Container = styled(View)`
	align-items: center;
	flex-direction: row;
`;

const CurrentFileLabel = styled(Text)`
	color: ${(props) => props.theme.TITLE};
`;

const CurrentFileSize = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
`;

const Left = styled(View)<{
	width: number;
}>`
	width: ${(props) => props.width / 6}px;
	height: ${(props) => props.width / 6}px;
	justify-content: center;
	align-items: center;
`;

const Spacer = styled(View)`
	width: 8px;
`;

const Right = styled(Flexer)``;

const ClearIcon = styled(Image)`
	width: 20px;
	height: 20px;
	tint-color: ${(props) => props.theme.SUBTITLE};
`;

export const FileUploadPreview: React.FC<{
	temporaryFile: DocumentPickerResponse;
	uploadProgress: number;
	onRemove: () => void;
	fileShareRequest: FixedDocumentData | null;
}> = ({temporaryFile, uploadProgress, onRemove, fileShareRequest}) => {
	const uploadProgressLabel = useMemo(() => {
		if (!temporaryFile) {
			return null;
		}

		if (uploadProgress === 1) {
			return prettyBytes(Number(temporaryFile.size));
		}

		return `${prettyBytes(
			Number(temporaryFile.size) * uploadProgress
		)} / ${prettyBytes(Number(temporaryFile.size))}`;
	}, [temporaryFile, uploadProgress]);

	const {width} = useWindowDimensions();
	return (
		<Container>
			<Left width={width}>
				{fileShareRequest ? (
					<FileThumbnail s3Key={fileShareRequest?.s3Key} size={80} />
				) : (
					<CircularProgress progress={uploadProgress} />
				)}
			</Left>
			<Spacer />
			<Spacer />
			<Right>
				<CurrentFileLabel numberOfLines={1} ellipsizeMode="tail">
					{temporaryFile.name}
				</CurrentFileLabel>
				<CurrentFileSize>{uploadProgressLabel}</CurrentFileSize>
			</Right>
			<Spacer />
			<TouchableOpacity onPress={onRemove}>
				<ClearIcon source={require('../../assets/clear.png')} />
			</TouchableOpacity>
		</Container>
	);
};
