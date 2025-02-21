import {useActionSheet} from '@expo/react-native-action-sheet';
import React, {useCallback} from 'react';
import {TouchableOpacity} from 'react-native';
import {Alert, Image} from 'react-native-normalized';
import styled from 'styled-components/native';
import {reportReview} from '../../../core/functions/api';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';
import {reportToSentry} from '../api/report-to-sentry';

const Container = styled(TouchableOpacity)`
	padding-left: 6px;
`;

const Icon = styled(Image)`
	height: 20px;
	width: 20px;
	tint-color: ${(props) => props.theme.SUBTITLE};
`;

export const ReviewMoreMenu: React.FC<{
	reviewId: string;
}> = ({reviewId}) => {
	const actionSheet = useActionSheet();
	const language = useLanguage();
	const token = useAppState((s) => getUserHash(s, null));

	const REPORT_OPTION = rawStrings.REPORT_REVIEW[language];
	const CANCEL_BUTTON = rawStrings.CANCEL[language];

	const onReportSelected = useCallback(() => {
		const {
			REPORT_SPAM,
			REPORT_INAPPROPRIATE,
			REPORT_SEXUAL_CONTENT,
			REPORT_PROHIBITED_CONTENT,
			REPORT_HARASSMENT,
			REPORT_OFFENSIVE,
			REPORT_OTHER,
		} = rawStrings;
		const reportOptions: string[] = [
			REPORT_SPAM[language],
			REPORT_INAPPROPRIATE[language],
			REPORT_SEXUAL_CONTENT[language],
			REPORT_PROHIBITED_CONTENT[language],
			REPORT_HARASSMENT[language],
			REPORT_OFFENSIVE[language],
			REPORT_OTHER[language],
			rawStrings.CANCEL[language],
		];
		actionSheet.showActionSheetWithOptions(
			{
				options: reportOptions,
				cancelButtonIndex: reportOptions.indexOf(rawStrings.CANCEL[language]),
			},
			(index) => {
				if (reportOptions[index] === rawStrings.CANCEL[language]) {
					return;
				}

				reportReview({
					id: reviewId,
					token,
					reason: reportOptions[index],
				})
					.then(() => {
						Alert.alert(rawStrings.REPORT_REVIEW_SUCCESS[language]);
					})
					.catch((err) => {
						reportToSentry(err);
						Alert.alert(rawStrings.REPORT_REVIEW_FAILURE[language]);
					});
			}
		);
	}, [actionSheet, language, reviewId, token]);

	const onPress = useCallback(() => {
		const options = [REPORT_OPTION, CANCEL_BUTTON];
		actionSheet.showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex: options.indexOf(CANCEL_BUTTON),
			},
			(selected) => {
				if (selected === options.indexOf(REPORT_OPTION)) {
					onReportSelected();
				}
			}
		);
	}, [CANCEL_BUTTON, REPORT_OPTION, actionSheet, onReportSelected]);
	return (
		<Container onPress={onPress}>
			<Icon source={require('../assets/baseline_more_vert_black_18dp.png')} />
		</Container>
	);
};
