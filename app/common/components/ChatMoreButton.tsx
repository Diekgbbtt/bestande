import {useActionSheet} from '@expo/react-native-action-sheet';
import React, {useCallback} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Image} from 'react-native-normalized';
import styled from 'styled-components';
import {useLanguage} from '../../../core/functions/use-language';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import {Institution} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {ReportGradeScreens} from './ReportGrade/ReportGradeNavigator';

const Container = styled(View)`
	padding: 8px;
	border-radius: 30px;
	background-color: ${(props) => props.theme.TAG_BACKGROUND};
`;

const Icon = styled(Image)`
	height: 24px;
	width: 24px;
	tint-color: ${(props) => props.theme.SUBTITLE};
`;

export const ChatMoreButton: React.FC<{
	uni_identifier: string;
	university: Institution;
	goToStatistic: () => void;
}> = ({uni_identifier, university, goToStatistic}) => {
	const actionSheet = useActionSheet();
	const language = useLanguage();
	const navigation = useNavigationInNative();

	const onPress = useCallback(() => {
		const options = [
			'UPLOAD_FILE' as const,
			'REPORT_GRADE' as const,
			'CANCEL' as const,
		];
		actionSheet.showActionSheetWithOptions(
			{
				options: options.map((k) => rawStrings[k][language]),
				cancelButtonIndex: options.findIndex((o) => o === 'CANCEL'),
			},
			(index) => {
				if (options[index] === 'UPLOAD_FILE') {
					navigation.navigate('UploadFile', {
						uni_identifier,
						university,
						onFileAdd: () => undefined,
					});
				}

				if (options[index] === 'REPORT_GRADE') {
					navigation.navigate('ReportGrade', {
						// @ts-expect-error
						screen: 'ReportGradeStart',
						params: {
							uni_identifier,
							university,
							goToStatistic,
							usernameOverride: null,
							suggestedEndDate: null,
						} as ReportGradeScreens['ReportGradeStart'],
					});
				}
			}
		);
	}, [
		actionSheet,
		goToStatistic,
		language,
		navigation,
		uni_identifier,
		university,
	]);

	return (
		<TouchableOpacity onPress={onPress}>
			<Container>
				<Icon source={require('../assets/add.png')} />
			</Container>
		</TouchableOpacity>
	);
};
