import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {TouchableOpacity} from 'react-native';
import {email as composeEmail} from 'react-native-communications';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Content, SideSpacing, VSpace} from '../../../../core/components/Base';
import {formatString} from '../../../../core/functions/format-string';
import {renderSemester} from '../../../../core/functions/render-semester';
import {useLanguage} from '../../../../core/functions/use-language';
import rawStrings from '../../../../core/raw-strings';
import {GradeReportReturnType} from '../../api/get-report-grade-data';
import {FatModalTitle} from '../FatModalTitle';
import {
	BlueButton,
	BlueButtonLabel,
	Explainer,
	ReportGradeContainer,
	Scroller,
} from './SharedReportGrade';

export const ReportGradeAlreadyEntered: React.FC<{
	reportStatus: GradeReportReturnType;
	goToStatistic: () => void;
}> = ({reportStatus, goToStatistic}) => {
	if (reportStatus.type !== 'grades_already_entered') {
		throw new Error('expected grades already entered');
	}

	const safe = useSafeAreaInsets();
	const language = useLanguage();
	const navigation = useNavigation();

	const reportError = useCallback(() => {
		composeEmail(
			['info@bestande.ch'],
			[],
			[],
			rawStrings.WRONG_EXAM_RETURN_STATISTIC[language],
			[
				`ID: ${reportStatus.statistic.uni_identifier}`,
				`${rawStrings.SEMESTER[language]}: ${reportStatus.statistic.period}`,
			].join('\n')
		);
	}, [
		language,
		reportStatus.statistic.period,
		reportStatus.statistic.uni_identifier,
	]);

	const onPressStatistic = useCallback(() => {
		navigation.goBack();
		goToStatistic();
	}, [goToStatistic, navigation]);

	return (
		<ReportGradeContainer safeBottom={safe.bottom}>
			<Scroller>
				<VSpace />
				<VSpace />
				<FatModalTitle>{rawStrings.REPORT_GRADE_TITLE[language]}</FatModalTitle>
				<VSpace />
				<VSpace />
				<Explainer>
					{formatString(
						rawStrings.SOMEONE_ELSE_REPORTED[language],
						renderSemester(reportStatus.statistic.period, language) as string
					)}
				</Explainer>
				<VSpace />
				<VSpace />
				<Explainer>{rawStrings.SOMEONE_ELSE_REPORTED_2[language]}</Explainer>
			</Scroller>
			<SideSpacing>
				<TouchableOpacity onPress={reportError}>
					<BlueButton>
						<Content>
							<BlueButtonLabel>
								{rawStrings.REPORT_ERROR[language]}
							</BlueButtonLabel>
						</Content>
					</BlueButton>
				</TouchableOpacity>
				<VSpace />
				<TouchableOpacity onPress={onPressStatistic}>
					<BlueButton>
						<Content>
							<BlueButtonLabel>
								{rawStrings.GOTO_STATISTIC[language]}
							</BlueButtonLabel>
						</Content>
					</BlueButton>
				</TouchableOpacity>
			</SideSpacing>
			<VSpace />
			<VSpace />
		</ReportGradeContainer>
	);
};
