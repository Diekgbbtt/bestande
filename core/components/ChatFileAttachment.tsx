import format from 'date-fns/format';
import prettyBytes from 'pretty-bytes';
import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {getDocument} from '../functions/api';
import {openLink} from '../functions/open-link';
import {globalStyles} from '../functions/styles';
import {useLanguage} from '../functions/use-language';
import rawStrings from '../raw-strings';
import {ExpandedPublicFileSharingDocument} from '../types/file-sharing-document';
import {HSpace} from './Base';
import {FileThumbnail} from './FileThumbnail';
import {Flexer, Row} from './Primitives';
import {UnifiedProgress} from './UnifiedProgress';

const Container = styled(View)`
	height: 80px;
	background-color: ${(props) => props.theme.TAG_BACKGROUND};
	padding: 12px;
	margin-top: 3px;
	margin-bottom: 3px;
	border-radius: 3px;
`;

const ThumbnailContainer = styled(View)`
	background-color: ${(props) => props.theme.BORDER_COLOR};
	border-radius: 3px;
`;

const Centered = styled(Flexer)`
	justify-content: center;
	align-items: center;
`;

const Label = styled(Text)`
	color: ${(props) => props.theme.TITLE};
`;

const Subtitle = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
`;

const NotFoundLabel = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
	align-self: center;
`;

const FlexRow = styled(Row)`
	align-items: center;
`;

export const ChatFileAttachment: React.FC<{
	fileId: string;
}> = ({fileId}) => {
	const language = useLanguage();
	const [file, setFile] = useState<ExpandedPublicFileSharingDocument | null>(
		null
	);
	const [loaded, setLoaded] = useState<boolean>(false);

	const loadFile = useCallback(async (id: string) => {
		try {
			const res = await getDocument(id);
			setFile(res);
		} catch (err) {
			console.log(err);
		} finally {
			setLoaded(true);
		}
	}, []);

	useEffect(() => {
		loadFile(fileId);
	}, [fileId, loadFile]);

	const openFile = useCallback(() => {
		openLink(`https://bestande.ch/files/${fileId}`);
	}, [fileId]);

	return (
		<Container>
			{loaded ? (
				file ? (
					<TouchableOpacity onPress={openFile}>
						<FlexRow>
							<ThumbnailContainer>
								<FileThumbnail s3Key={file.s3Key} size={60} />
							</ThumbnailContainer>
							<HSpace />
							<HSpace />
							<View style={globalStyles.flex1}>
								<Label numberOfLines={1} ellipsizeMode="tail">
									{file.fileName}
								</Label>
								<Subtitle>
									{prettyBytes(file.fileSize)} •{' '}
									{format(file.uploaded, 'dd.MM.yyyy')}
								</Subtitle>
							</View>
						</FlexRow>
					</TouchableOpacity>
				) : (
					<Centered>
						<NotFoundLabel>{rawStrings.FILE_NOT_FOUND[language]}</NotFoundLabel>
					</Centered>
				)
			) : (
				<Centered>
					<UnifiedProgress />
				</Centered>
			)}
		</Container>
	);
};
