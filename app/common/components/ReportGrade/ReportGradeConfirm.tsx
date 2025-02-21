import {
	NavigationProp,
	RouteProp,
	useNavigation,
	useRoute,
} from '@react-navigation/native';
import format from 'date-fns/format';
import React, {useCallback, useState} from 'react';
import {Switch, TouchableOpacity, View} from 'react-native';
import {Alert, Text} from 'react-native-normalized';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styled from 'styled-components';
import {Content, SideSpacing, VSpace} from '../../../../core/components/Base';
import {Row} from '../../../../core/components/Primitives';
import {submitExamReturn} from '../../../../core/functions/api';
import {formatString} from '../../../../core/functions/format-string';
import {getUserHash} from '../../../../core/functions/get-user-hash';
import {hasGodmodeAccess} from '../../../../core/functions/has-godmode-access';
import {renderSemester} from '../../../../core/functions/render-semester';
import {globalStyles} from '../../../../core/functions/styles';
import {useAppState} from '../../../../core/functions/use-app-state';
import {useLanguage} from '../../../../core/functions/use-language';
import rawStrings from '../../../../core/raw-strings';
import {getPeriodForDate} from '../../../../web/src/components/get-period-for-date';
import {daysAndHoursLabel} from '../../api/days-and-hours-label';
import {getUserName} from '../../api/get-user-name';
import {reportToSentry} from '../../api/report-to-sentry';
import {FatModalTitle} from '../FatModalTitle';
import {ReportGradeScreens} from './ReportGradeNavigator';
import {
	BlueButton,
	BlueButtonLabel,
	Explainer,
	ReportGradeContainer,
	Scroller,
} from './SharedReportGrade';

const PaddedRow = styled(Row)`
	padding-top: 8px;
	padding-bottom: 8px;
`;

const LeftLabel = styled(Text)`
	color: ${(props) => props.theme.TITLE};
`;

const RightLabel = styled(Text)`
	color: ${(props) => props.theme.TITLE};
`;

export const ReportGradeConfirm: React.FC = () => {
	const {bottom} = useSafeAreaInsets();
	const language = useLanguage();

	const username = useAppState((state) => getUserName(state));

	const navigation = useNavigation<
		NavigationProp<ReportGradeScreens, 'ReportGradeConfirm'>
	>();

	const {params} = useRoute<
		RouteProp<ReportGradeScreens, 'ReportGradeConfirm'>
	>();
	const token = useAppState((state) => getUserHash(state, null));
	const isGodmode = useAppState((state) => hasGodmodeAccess(state));
	const [skipNotification, setSkipNotification] = useState(false);

	const {
		exam_end_date,
		return_date,
		university,
		uni_identifier,
		usernameOverride,
	} = params;

	const submit = useCallback(async () => {
		try {
			await submitExamReturn({
				exam_date: exam_end_date,
				return_date,
				period: getPeriodForDate(new Date(exam_end_date)),
				uni_identifier,
				university,
				token,
				usernameOverride: usernameOverride ?? undefined,
				skipNotification,
			});
			navigation.navigate('ReportGradeDone');
		} catch (err) {
			reportToSentry(err);

			Alert.alert(
				rawStrings.ERROR[language],
				rawStrings.REPORT_GRADE_STATUS_ERROR[language],
				[
					{
						text: rawStrings.OK[language],
						onPress: () => undefined,
					},
				]
			);
		}
	}, [
		exam_end_date,
		language,
		navigation,
		return_date,
		skipNotification,
		token,
		uni_identifier,
		university,
		usernameOverride,
	]);

	return (
		<ReportGradeContainer safeBottom={bottom}>
			<Scroller>
				<VSpace />
				<FatModalTitle>{rawStrings.EVERYTHING_OK[language]}</FatModalTitle>
				<VSpace />
				<VSpace />
				<Explainer>
					{
						formatString(
							rawStrings.REPORT_GRADE_REVIEW[language],
							username as string
						) as string
					}
				</Explainer>
				<VSpace />
				<VSpace />
				<PaddedRow>
					<LeftLabel>{rawStrings.SEMESTER[language]}</LeftLabel>
					<View style={globalStyles.flex1} />
					<RightLabel>
						{renderSemester(
							getPeriodForDate(new Date(exam_end_date)),
							language
						)}
					</RightLabel>
				</PaddedRow>
				<PaddedRow>
					<LeftLabel>{rawStrings.END_OF_EXAM[language]}</LeftLabel>
					<View style={globalStyles.flex1} />
					<RightLabel>{format(exam_end_date, 'dd.MM.yyyy HH:mm')}</RightLabel>
				</PaddedRow>
				<PaddedRow>
					<LeftLabel>{rawStrings.GRADE_RELEASE_DATE[language]}</LeftLabel>
					<View style={globalStyles.flex1} />
					<RightLabel>{format(return_date, 'dd.MM.yyyy HH:mm')}</RightLabel>
				</PaddedRow>
				<PaddedRow>
					<LeftLabel>{rawStrings.DURATION[language]}</LeftLabel>
					<View style={globalStyles.flex1} />
					<RightLabel>
						{daysAndHoursLabel(exam_end_date, return_date, language)}
					</RightLabel>
				</PaddedRow>
				{params.usernameOverride ? (
					<PaddedRow>
						<LeftLabel>{rawStrings.USERNAME[language]}</LeftLabel>
						<View style={globalStyles.flex1} />
						<RightLabel>{params.usernameOverride}</RightLabel>
					</PaddedRow>
				) : null}
				{isGodmode ? (
					<PaddedRow>
						<LeftLabel>{"Don't notify"}</LeftLabel>
						<View style={globalStyles.flex1} />
						<Switch
							value={skipNotification}
							onValueChange={setSkipNotification}
						/>
					</PaddedRow>
				) : null}
			</Scroller>
			<View style={globalStyles.flex1} />
			<SideSpacing>
				<TouchableOpacity onPress={submit}>
					<BlueButton>
						<Content>
							<BlueButtonLabel>{rawStrings.SEND[language]}</BlueButtonLabel>
						</Content>
					</BlueButton>
				</TouchableOpacity>
			</SideSpacing>
			<VSpace />
			<VSpace />
		</ReportGradeContainer>
	);
};
