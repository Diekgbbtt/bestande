import { useActionSheet } from '@expo/react-native-action-sheet';
import format from 'date-fns/format';
import prettyBytes from 'pretty-bytes';
import React, { useCallback } from 'react';
import { TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Alert, Text } from 'react-native-normalized';
import styled from 'styled-components';
import { FileThumbnail } from '../../../../core/components/FileThumbnail';
import { HudManager } from '../../../../core/components/HudManager';
import { deleteDocument } from '../../../../core/functions/api';
import { getUserHash } from '../../../../core/functions/get-user-hash';
import { openLink } from '../../../../core/functions/open-link';
import { truthy } from '../../../../core/functions/truthy';
import { useAppState } from '../../../../core/functions/use-app-state';
import { useLanguage } from '../../../../core/functions/use-language';
import rawStrings from '../../../../core/raw-strings';
import { ExpandedPublicFileSharingDocument } from '../../../../core/types/file-sharing-document';

const Container = styled(View) <{
	width: number;
}>`
	width: ${(props) => props.width / 3}px;
	align-items: center;
	margin-top: 10px;
	margin-bottom: 10px;
	padding-left: 10px;
	padding-right: 10px;
`;

const Filename = styled(Text)`
	margin-top: 7px;
	font-size: 13px;
	text-align: center;
	color: ${(props) => props.theme.TITLE};
`;

const FileSubtitle = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
	font-size: 11px;
	margin-top: 3px;
`;

export const FilePreview: React.FC<{
	file: any;
	onDeleted: (id: string) => void;
}> = ({ file, onDeleted }) => {
	const actionSheet = useActionSheet();

	const token = useAppState((state) => getUserHash(state, null));
	const userId = useAppState((state) => state.users.userProfile?.id);
	const language = useLanguage();

	const canDelete = file.user.id === userId;

	const deleteFile = useCallback(async () => {
		try {
			await deleteDocument(file._id, token);
			onDeleted(file._id);
			HudManager.setHudContent({
				icon: require('../../assets/trash-square.png'),
				label: rawStrings.DELETED[language] + '!',
			});
		} catch (err) {
			Alert.alert(
				rawStrings.ERROR[language],
				rawStrings.COULD_NOT_DELETE_DOCUMENT[language],
				[
					{
						text: rawStrings.OK[language],
						onPress: () => undefined,
					},
				]
			);
			console.log('err', err);
		}
	}, [file._id, language, onDeleted, token]);

	const openInBrowser = useCallback(() => {
		openLink(`https://bestande.ch/files/${file._id}`);
	}, [file._id]);

	const openMenu = useCallback(() => {
		if (!canDelete) {
			openInBrowser();
			return;
		}

		const options = [
			'SHOW' as const,
			'DELETE' as const,
			'CANCEL' as const,
		].filter(truthy);
		actionSheet.showActionSheetWithOptions(
			{
				options: options.map((k) => rawStrings[k][language]),
				cancelButtonIndex: options.findIndex((o) => o === 'CANCEL'),
				destructiveButtonIndex: options.findIndex((o) => o === 'DELETE'),
			},
			(index) => {
				if (options[index] === 'SHOW') {
					openInBrowser();
				}

				if (options[index] === 'DELETE') {
					deleteFile();
				}
			}
		);
	}, [actionSheet, canDelete, deleteFile, language, openInBrowser]);

	const { width } = useWindowDimensions();
	return (
		<TouchableOpacity onPress={() => openMenu()}>
			<Container width={width}>
				<FileThumbnail s3Key={file.s3Key} size={width / 6} />
				<Filename numberOfLines={2} ellipsizeMode="tail">
					{file.fileName}
				</Filename>
				<FileSubtitle>
					{prettyBytes(file.fileSize)} • {format(file.uploaded, 'dd.MM.yyyy')}
				</FileSubtitle>
			</Container>
		</TouchableOpacity>
	);
};
