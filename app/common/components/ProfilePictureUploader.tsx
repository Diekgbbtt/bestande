import {useActionSheet} from '@expo/react-native-action-sheet';
import React, {useCallback} from 'react';
import {Linking, TouchableOpacity} from 'react-native';
import ImagePicker, {
	Image as CroppedImage,
} from 'react-native-image-crop-picker';
import {Alert, Text} from 'react-native-normalized';
import {RNS3} from 'react-native-s3-upload';
import {useDispatch} from 'react-redux';
import {v4 as uuid} from 'uuid';
import {Base, Content} from '../../../core/components/Base';
import {HudManager} from '../../../core/components/HudManager';
import {
	deleteProfilePicture,
	updateProfilePicture,
} from '../../../core/functions/api';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {truthy} from '../../../core/functions/truthy';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';
import {removeAvatar, updateAvatar} from '../../../core/reducers/users';

export const ProfilePictureUploader = () => {
	const [progress, setUploadProgress] = React.useState<number>(0);
	const language = useLanguage();
	const userProfile = useAppState((state) => state.users.userProfile);
	const appearance = useAppearance();
	const token = useAppState((state) => getUserHash(state, null));
	const dispatch = useDispatch();
	const actionSheet = useActionSheet();

	const removePicture = useCallback(async () => {
		await deleteProfilePicture(token);
		dispatch(removeAvatar());
	}, [dispatch, token]);

	const pickOrTakePicture = useCallback(
		async (mode: 'pick' | 'take') => {
			const cameraOptions = {
				width: 400,
				height: 400,
				cropping: true,
			};
			try {
				const image =
					mode === 'take'
						? ((await ImagePicker.openCamera(cameraOptions)) as CroppedImage)
						: ((await ImagePicker.openPicker(cameraOptions)) as CroppedImage);
				const options = {
					keyPrefix: '',
					bucket: 'bestande',
					region: 'eu-central-1',
					accessKey: 'AKIA6GSVL7ZMT5REPPHC',
					secretKey: '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',
				};
				const response = await RNS3.put(
					{
						uri: image.path,
						name: `profile-${uuid()}.jpg`,
						type: image.mime,
					},
					options
				).progress((p) => {
					setUploadProgress(p.percent);
				});
				const serverResponse = await updateProfilePicture(
					token,
					response.body.postResponse.key
				);
				setUploadProgress(0);
				dispatch(updateAvatar(serverResponse.avatar));
				HudManager.setHudContent({
					label: rawStrings.UPLOADED[language],
				});
			} catch (err) {
				if (err.message.match(/access/)) {
					Alert.alert(
						rawStrings.NO_IMAGE_PICKER_PERMISSION[language],
						rawStrings.GIVE_IMAGE_PICKER_PERMISSION[language],
						[
							{
								text: rawStrings.OPEN_APP_SETTINGS[language],
								onPress: () => Linking.openSettings(),
							},
							{
								text: rawStrings.NOT_NOW[language],
							},
						]
					);
				} else if (err.message.match(/User cancelled/)) {
					// noop
				} else {
					Alert.alert(rawStrings.ERROR[language] + ': ' + err.message);
				}

				setUploadProgress(0);
			}
		},
		[dispatch, language, token]
	);

	const launchSheet = useCallback(() => {
		const selectImageLabel = rawStrings.SELECT_IMAGE[language];
		const takePictureLabel = rawStrings.TAKE_PICTURE[language];
		const removePictureLabel = rawStrings.REMOVE_PICTURE[language];
		const cancelLabel = rawStrings.CANCEL[language];
		const options = [
			selectImageLabel,
			takePictureLabel,
			userProfile?.avatar ? removePictureLabel : null,
			cancelLabel,
		].filter(truthy);
		const cancelButtonIndex = options.length - 1;
		const destructiveButtonIndex = options.indexOf(removePictureLabel);
		actionSheet.showActionSheetWithOptions(
			{options, cancelButtonIndex, destructiveButtonIndex},
			(buttonIndex) => {
				if (options[buttonIndex] === selectImageLabel) {
					pickOrTakePicture('pick');
				}

				if (options[buttonIndex] === takePictureLabel) {
					pickOrTakePicture('take');
				}

				if (options[buttonIndex] === removePictureLabel) {
					removePicture();
				}

				if (options[buttonIndex] === cancelLabel) {
					// cancel
				}
			}
		);
	}, [
		actionSheet,
		language,
		pickOrTakePicture,
		removePicture,
		userProfile?.avatar,
	]);

	if (!userProfile) {
		return null;
	}

	return (
		<TouchableOpacity disabled={progress > 0} onPress={() => launchSheet()}>
			<Base padded>
				<Content>
					<Text
						style={{
							fontWeight: 'bold',
							color: appearance.BUTTON_LABEL_COLOR,
						}}
					>
						{progress > 0
							? `${rawStrings.UPLOADING[language]}... ${Math.floor(
									progress * 100
							  )}%`
							: rawStrings.SET_PROFILE_PICTURE[language]}
					</Text>
				</Content>
			</Base>
		</TouchableOpacity>
	);
};
