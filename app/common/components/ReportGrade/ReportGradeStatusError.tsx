import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Content, SideSpacing, VSpace} from '../../../../core/components/Base';
import {useLanguage} from '../../../../core/functions/use-language';
import rawStrings from '../../../../core/raw-strings';
import {reportToSentry} from '../../api/report-to-sentry';
import {FatModalTitle} from '../FatModalTitle';
import {
	BlueButton,
	BlueButtonLabel,
	Explainer,
	ReportGradeContainer,
	Scroller,
} from './SharedReportGrade';

export const ReportGradeStatusError: React.FC<{
	error: Error;
}> = ({error}) => {
	const language = useLanguage();
	const safe = useSafeAreaInsets();
	const navigation = useNavigation();

	useEffect(() => {
		reportToSentry(error);
	}, [error]);

	const goBack = useCallback(() => {
		navigation.goBack();
	}, [navigation]);

	return (
		<ReportGradeContainer safeBottom={safe.bottom}>
			<Scroller>
				<VSpace />
				<FatModalTitle>{rawStrings.ERROR[language]}</FatModalTitle>
				<VSpace />
				<Explainer>{rawStrings.REPORT_GRADE_STATUS_ERROR[language]}</Explainer>
			</Scroller>

			<SideSpacing>
				<TouchableOpacity onPress={goBack}>
					<BlueButton>
						<Content>
							<BlueButtonLabel>{rawStrings.OK[language]}</BlueButtonLabel>
						</Content>
					</BlueButton>
				</TouchableOpacity>
			</SideSpacing>
			<VSpace />
			<VSpace />
		</ReportGradeContainer>
	);
};
