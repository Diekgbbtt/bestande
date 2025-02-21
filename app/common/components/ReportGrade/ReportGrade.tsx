import {
	NavigationProp,
	RouteProp,
	useNavigation,
	useRoute,
} from '@react-navigation/native';
import last from 'lodash/last';
import sortBy from 'lodash/sortBy';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {InteractionManager, TouchableOpacity} from 'react-native';
import {ActivityIndicator, Alert, Text} from 'react-native-normalized';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styled from 'styled-components';
import {Content, SideSpacing, VSpace} from '../../../../core/components/Base';
import {Colors} from '../../../../core/functions/Colors';
import {formatString} from '../../../../core/functions/format-string';
import {renderSemester} from '../../../../core/functions/render-semester';
import {globalStyles} from '../../../../core/functions/styles';
import {useAppState} from '../../../../core/functions/use-app-state';
import {useLanguage} from '../../../../core/functions/use-language';
import rawStrings from '../../../../core/raw-strings';
import {getPeriodForDate} from '../../../../web/src/components/get-period-for-date';
import {getApiResponse} from '../../api/get-api-response';
import {
	getReportGradeData,
	GradeReportReturnType,
} from '../../api/get-report-grade-data';
import {FatModalTitle} from '../FatModalTitle';
import {SmallCalendar} from '../SmallCalendar';
import {ReportGradeAlreadyEntered} from './ReportGradeAlreadyEntered';
import {ReportGradeScreens} from './ReportGradeNavigator';
import {ReportGradeStatusError} from './ReportGradeStatusError';
import {
	BlueButton,
	BlueButtonLabel,
	Explainer,
	ReportGradeContainer,
	Scroller,
} from './SharedReportGrade';

const ErrorMessage = styled(Text)`
	color: ${Colors.Red};
	font-size: 13px;
`;

export const ReportGrade: React.FC = () => {
	const language = useLanguage();
	const safe = useSafeAreaInsets();
	const navigation = useNavigation<
		NavigationProp<ReportGradeScreens, 'ReportGradeStart'>
	>();

	const [
		reportStatus,
		setReportStatus,
	] = useState<GradeReportReturnType | null>(null);
	const [reportStatusError, setReportStatusError] = useState<Error | null>(
		null
	);
	const [startDate, setStartDate] = useState(() => Date.now());

	const onStartDateChange = useCallback((e, d?: Date | undefined) => {
		setStartDate((d as Date).getTime());
	}, []);

	const {
		params: {
			uni_identifier,
			university,
			goToStatistic,
			usernameOverride,
			suggestedEndDate,
		},
	} = useRoute<RouteProp<ReportGradeScreens, 'ReportGradeStart'>>();

	const apiResponse = useAppState((state) =>
		getApiResponse(state, university, uni_identifier)
	);

	const defaultPeriod = useMemo(() => {
		return last(
			sortBy(
				apiResponse.details?.semesters.map((s) => s.period),
				(p) => p
			)
		) as number;
	}, [apiResponse.details?.semesters]);

	const goToConfirm = useCallback(async () => {
		try {
			if (startDate > Date.now()) {
				Alert.alert(
					rawStrings.ERROR[language],
					rawStrings.CANNOT_ENTER_GRADE_FOR_FUTURE_EXAM[language],
					[
						{
							onPress: () => undefined,
							text: rawStrings.OK[language],
						},
					]
				);
				return;
			}

			const semesterSelected = getPeriodForDate(new Date(startDate));
			if (semesterSelected !== defaultPeriod) {
				const newReport = await getReportGradeData({
					apiResponse,
					institution: university,
					moduleId: uni_identifier,
					period: semesterSelected,
				});
				if (newReport.type === 'grades_already_entered') {
					Alert.alert(
						rawStrings.ERROR[language],
						formatString(
							rawStrings.INLINE_SEMESTER_ALREADY_HAS_GRADE_ENTERED[language],
							renderSemester(semesterSelected, language) as string
						),
						[
							{
								text: rawStrings.OK[language],
							},
						]
					);
					return;
				}

				if (newReport.type === 'semester_unavailable') {
					Alert.alert(
						rawStrings.ERROR[language],
						formatString(
							rawStrings.INLINE_SEMESTER_UNAVAILABLE[language],
							renderSemester(semesterSelected, language) as string
						),
						[
							{
								text: rawStrings.OK[language],
							},
						]
					);
					return;
				}
			}

			navigation.navigate('ReportGradeEndDate', {
				exam_end_date: startDate,
				uni_identifier,
				university,
				usernameOverride,
				suggestedEndDate,
			});
		} catch (err) {
			Alert.alert(
				rawStrings.ERROR[language],
				rawStrings.REPORT_GRADE_STATUS_ERROR[language],
				[
					{
						text: rawStrings.OK[language],
						onPress: () => {
							navigation.goBack();
						},
					},
				]
			);
		}
	}, [
		apiResponse,
		defaultPeriod,
		language,
		navigation,
		startDate,
		suggestedEndDate,
		uni_identifier,
		university,
		usernameOverride,
	]);

	useEffect(() => {
		getReportGradeData({
			institution: university,
			moduleId: uni_identifier,
			period: defaultPeriod,
			apiResponse,
		})
			.then((st) => {
				InteractionManager.runAfterInteractions(() => {
					if (st.type === 'valid') {
						setStartDate(st.lastExamDate);
					}

					setReportStatus(st);
				});
			})
			.catch((err) => {
				setReportStatusError(err);
			});
	}, [apiResponse, defaultPeriod, uni_identifier, university]);

	if (reportStatusError) {
		return <ReportGradeStatusError error={reportStatusError} />;
	}

	if (!reportStatus) {
		return (
			<ReportGradeContainer
				safeBottom={safe.bottom}
				style={globalStyles.allCentered}
			>
				<ActivityIndicator />
			</ReportGradeContainer>
		);
	}

	if (reportStatus.type === 'grades_already_entered') {
		return (
			<ReportGradeAlreadyEntered
				reportStatus={reportStatus}
				goToStatistic={goToStatistic}
			/>
		);
	}

	return (
		<ReportGradeContainer safeBottom={safe.bottom}>
			<Scroller style={globalStyles.flex1}>
				<VSpace />
				<FatModalTitle>{rawStrings.REPORT_GRADE_TITLE[language]}</FatModalTitle>
				<VSpace />
				<VSpace />
				<Explainer>{rawStrings.REPORT_GRADE_EXPLAINER[language]}</Explainer>
				<VSpace />
				<Explainer>{rawStrings.REPORT_GRADE_ENTER_GRADE[language]}</Explainer>
				<VSpace />
				<VSpace />

				<SmallCalendar
					value={new Date(startDate)}
					display={'inline'}
					mode="datetime"
					onChange={onStartDateChange}
					locale={'de-ch'}
				/>
			</Scroller>
			<SideSpacing>
				{!reportStatus ? (
					<ActivityIndicator />
				) : reportStatus.type === 'semester_unavailable' ? (
					<ErrorMessage>
						{formatString(
							rawStrings.SEMESTER_UNAVAILABLE[language],
							renderSemester(defaultPeriod, language) as string
						)}
					</ErrorMessage>
				) : null}
				<VSpace />
				<VSpace />
				<TouchableOpacity onPress={goToConfirm}>
					<BlueButton>
						<Content>
							<BlueButtonLabel>{rawStrings.CONTINUE[language]}</BlueButtonLabel>
						</Content>
					</BlueButton>
				</TouchableOpacity>
			</SideSpacing>
			<VSpace />
			<VSpace />
		</ReportGradeContainer>
	);
};
