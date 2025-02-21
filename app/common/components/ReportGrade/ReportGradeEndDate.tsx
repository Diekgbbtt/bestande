import {
	NavigationProp,
	RouteProp,
	useNavigation,
	useRoute,
} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Platform, TouchableOpacity} from 'react-native';
import {Alert} from 'react-native-normalized';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Content, SideSpacing, VSpace} from '../../../../core/components/Base';
import {useLanguage} from '../../../../core/functions/use-language';
import rawStrings from '../../../../core/raw-strings';
import {FatModalTitle} from '../FatModalTitle';
import {SmallCalendar} from '../SmallCalendar';
import {ReportGradeScreens} from './ReportGradeNavigator';
import {
	BlueButton,
	BlueButtonLabel,
	Explainer,
	ReportGradeContainer,
	Scroller,
} from './SharedReportGrade';

export const ReportGradeEndDate: React.FC = () => {
	const {params} = useRoute<
		RouteProp<ReportGradeScreens, 'ReportGradeEndDate'>
	>();

	const [endDate, setEndDate] = useState(
		() => params.suggestedEndDate ?? Date.now()
	);

	const safe = useSafeAreaInsets();
	const language = useLanguage();
	const navigation = useNavigation<
		NavigationProp<ReportGradeScreens, 'ReportGradeStart'>
	>();

	const onEndDateChange = useCallback((e, d?: Date | undefined) => {
		setEndDate((d as Date).getTime());
	}, []);

	const goToReview = useCallback(() => {
		if (endDate > Date.now()) {
			Alert.alert(
				rawStrings.ERROR[language],
				rawStrings.CANNOT_ENTER_GRADE_IN_THE_FUTURE[language],
				[
					{
						onPress: () => undefined,
						text: rawStrings.OK[language],
					},
				]
			);
			return;
		}

		if (endDate < params.exam_end_date) {
			Alert.alert(
				rawStrings.ERROR[language],
				rawStrings.END_DATE_CANNOT_BE_BEFORE_START_DATE[language],
				[
					{
						onPress: () => undefined,
						text: rawStrings.OK[language],
					},
				]
			);
			return;
		}

		navigation.navigate('ReportGradeConfirm', {
			exam_end_date: params.exam_end_date,
			return_date: new Date(endDate).getTime(),
			uni_identifier: params.uni_identifier,
			university: params.university,
			usernameOverride: params.usernameOverride,
		});
	}, [
		endDate,
		language,
		navigation,
		params.exam_end_date,
		params.uni_identifier,
		params.university,
		params.usernameOverride,
	]);

	return (
		<ReportGradeContainer safeBottom={safe.bottom}>
			<Scroller>
				<VSpace />
				<FatModalTitle>{rawStrings.EXAM_RETURN_DATE[language]}</FatModalTitle>
				<VSpace />
				<VSpace />
				<Explainer>{rawStrings.REPORT_GRADE_EARLIEST_DATE[language]}</Explainer>
				<VSpace />
				<VSpace />
				<SmallCalendar
					value={new Date(endDate)}
					display={Platform.OS === 'android' ? 'default' : 'inline'}
					mode="datetime"
					onChange={onEndDateChange}
					locale={'de-ch'}
				/>
			</Scroller>

			<SideSpacing>
				<TouchableOpacity onPress={goToReview}>
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
