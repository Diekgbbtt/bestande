import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useReducer} from 'react';
import {TouchableOpacity, View} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {Alert, Text, TextInput} from 'react-native-normalized';
import {RNS3} from 'react-native-s3-upload';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styled from 'styled-components';
import {v4 as uuid} from 'uuid';
import {VSpace} from '../../../../core/components/Base';
import {Button, ButtonLabel} from '../../../../core/components/BigButton';
import {CellWithSwitch} from '../../../../core/components/CellWithSwitch';
import {HudManager} from '../../../../core/components/HudManager';
import {Flexer, Row} from '../../../../core/components/Primitives';
import {SafeSideSpace} from '../../../../core/components/SafeSideSpace';
import {RN5Routes} from '../../../../core/data/rn5-routes';
import {uploadDocument} from '../../../../core/functions/api';
import {formatString} from '../../../../core/functions/format-string';
import {getUserHash} from '../../../../core/functions/get-user-hash';
import {useAppState} from '../../../../core/functions/use-app-state';
import {useAppearance} from '../../../../core/functions/use-appearance';
import {useLanguage} from '../../../../core/functions/use-language';
import {useNavigationInNative} from '../../../../core/functions/useNavigationInNative';
import rawStrings from '../../../../core/raw-strings';
import {getUserName} from '../../api/get-user-name';
import {FileUploadPreview} from './FileUploadPreview';
import {NoUsernameEmptyView} from './NoUsernameEmptyView';
import {reducer} from './reducer';
import {FixedDocumentData} from './types';

const Container = styled(Flexer)`
	background-color: ${(props) => props.theme.BACKGROUND};
	padding-left: 12px;
	padding-right: 12px;
	padding-top: 12px;
`;

const Inner = styled(SafeSideSpace)`
	flex: 1;
`;

const PickFileLabel = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
	text-align: center;
	font-weight: bold;
`;

const FileInputRow = styled(Row)`
	border-bottom-width: 1px;
	border-color: ${(props) => props.theme.BORDER_COLOR};
`;

const ExtensionLabel = styled(Text)`
	padding-top: 12px;
	padding-bottom: 12px;
	color: ${(props) => props.theme.TITLE};
`;

const FileNameInput = styled(TextInput)`
	padding-top: 12px;
	padding-bottom: 12px;
	color: ${(props) => props.theme.TITLE};
	flex: 1;
`;

const FileNameLabel = styled(Text)`
	font-weight: bold;
	color: ${(props) => props.theme.TITLE};
	margin-top: 20px;
`;

const SelectUploader = styled(View)`
	border-width: 2px;
	border-color: ${(props) => props.theme.SUBTITLE};
	padding: 30px;
	border-radius: 5px;
	border-style: dashed;
`;

const Disclaimer = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
	font-size: 13px;
`;

export const UploadFile: React.FC = () => {
	const {
		params: {uni_identifier, university, onFileAdd},
	} = useRoute<RouteProp<RN5Routes, 'UploadFile'>>();
	const language = useLanguage();
	const navigation = useNavigationInNative();
	const token = useAppState((state) => getUserHash(state, null));
	const appearance = useAppearance();
	const username = useAppState((state) => getUserName(state));
	const insets = useSafeAreaInsets();
	const [
		{temporaryFile, uploadToChat, fileName, uploadedFile, uploadProgress},
		dispatch,
	] = useReducer(reducer, {
		fileName: '',
		uploadToChat: true,
		temporaryFile: null,
		uploadProgress: 0,
		uploadedFile: null,
		posting: false,
	});

	const canPost = Boolean(uploadedFile);

	const [fileExtension, ...base] = (temporaryFile?.name || '')
		.split('.')
		.reverse();

	const fileBaseName = (base || []).reverse().join('.');

	const openFilePicker = useCallback(async () => {
		try {
			const file = await DocumentPicker.pick({
				type: [
					DocumentPicker.types.images,
					DocumentPicker.types.pdf,
					DocumentPicker.types.plainText,
				],
			});

			dispatch({type: 'setTemporaryFile', payload: file});
		} catch (err) {
			if (!DocumentPicker.isCancel(err)) {
				console.log(err);
			}
		}
	}, []);

	const handleTextChange = useCallback((text) => {
		dispatch({type: 'setFileName', payload: text});
	}, []);

	const uploadFailed = useCallback(() => {
		Alert.alert(
			rawStrings.ERROR[language],
			rawStrings.COULD_NOT_UPLOAD_DOCUMENT[language],
			[
				{
					text: rawStrings.OK[language],
					onPress: () => undefined,
				},
			]
		);
	}, [language]);

	const uploadToS3 = useCallback(async () => {
		if (!temporaryFile) {
			throw new Error('need temporary file');
		}

		dispatch({type: 'setUploadProgress', payload: 0.01});
		const preparedFile = {
			type: temporaryFile.type,
			uri: temporaryFile.uri,
			name: fileName || temporaryFile.name,
		};
		const options = {
			keyPrefix: uuid(),
			bucket: 'bestande',
			region: 'eu-central-1',
			accessKey: 'AKIA6GSVL7ZMT5REPPHC',
			secretKey: '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',
		};
		try {
			const response = await RNS3.put(preparedFile, options).progress(
				(progress) => {
					dispatch({type: 'setUploadProgress', payload: progress.percent});
				}
			);
			const document: FixedDocumentData = {
				fileSize: Number(temporaryFile.size),
				mimeType: temporaryFile.type,
				s3Key: response.body.postResponse.key,
				uni_identifier,
				university,
			};
			dispatch({type: 'setUploadedFile', payload: document});
		} catch (err) {
			dispatch({
				type: 'removeFile',
			});
			uploadFailed();
		}
	}, [fileName, temporaryFile, uni_identifier, university, uploadFailed]);

	const postFile = useCallback(async () => {
		if (!uploadedFile) {
			throw new Error('no uploaded file');
		}

		try {
			dispatch({type: 'setPosting', payload: true});
			const data = await uploadDocument({
				...uploadedFile,
				fileName: [fileName || fileBaseName, fileExtension].join('.'),
				sendToChat: uploadToChat,
				token,
			});
			onFileAdd(data.document);
			HudManager.setHudContent({
				label: rawStrings.UPLOADED[language],
			});
			navigation.goBack();
		} catch (err) {
			uploadFailed();
		} finally {
			dispatch({type: 'setPosting', payload: false});
		}
	}, [
		fileBaseName,
		fileExtension,
		fileName,
		language,
		navigation,
		onFileAdd,
		token,
		uploadFailed,
		uploadToChat,
		uploadedFile,
	]);

	useEffect(() => {
		if (temporaryFile && !uploadedFile) {
			uploadToS3();
		}
	}, [temporaryFile, uploadToS3, uploadedFile]);

	const setUploadToChat = useCallback((enabled: boolean) => {
		dispatch({type: 'setUploadToChat', payload: enabled});
	}, []);

	const onRemove = useCallback(() => {
		dispatch({type: 'removeFile'});
	}, []);

	if (!username) {
		return <NoUsernameEmptyView />;
	}

	return (
		<Container>
			<Inner>
				{temporaryFile ? (
					<FileUploadPreview
						temporaryFile={temporaryFile}
						uploadProgress={uploadProgress}
						fileShareRequest={uploadedFile}
						onRemove={onRemove}
					/>
				) : (
					<TouchableOpacity onPress={openFilePicker}>
						<SelectUploader>
							<PickFileLabel>{rawStrings.PICK_FILE[language]}</PickFileLabel>
						</SelectUploader>
					</TouchableOpacity>
				)}

				{uploadedFile !== null && (
					<>
						<FileNameLabel>{rawStrings.FILENAME[language]}</FileNameLabel>
						<FileInputRow>
							<FileNameInput
								value={fileName}
								placeholder={fileBaseName}
								placeholderTextColor={appearance.SUBTITLE}
								autoCapitalize="none"
								onChangeText={handleTextChange}
							/>
							<ExtensionLabel>.{fileExtension}</ExtensionLabel>
						</FileInputRow>
					</>
				)}

				<Flexer />
				<Disclaimer>
					{rawStrings.CAN_ONLY_UPLOAD_WITH_RIGHTS[language]}{' '}
					{formatString(rawStrings.OTHERS_CAN_SEE_USERNAME[language], username)}
				</Disclaimer>
				<VSpace />
				<VSpace />
				{username ? (
					<CellWithSwitch
						text={rawStrings.UPLOAD_TO_CHAT[language]}
						enabled={uploadToChat}
						onChange={setUploadToChat}
						loading={false}
					/>
				) : null}
				<VSpace />
				<VSpace />
				<Button onPress={postFile} disabled={!canPost}>
					<ButtonLabel>{rawStrings.UPLOAD_FILE[language]}</ButtonLabel>
				</Button>
			</Inner>
			<View style={{height: insets.bottom + 12}} />
		</Container>
	);
};
