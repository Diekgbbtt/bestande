import {useNavigation} from '@react-navigation/native';
import sortBy from 'lodash/sortBy';
import {lighten, transparentize} from 'polished';
import React, {useCallback, useMemo} from 'react';
import {Keyboard, TouchableHighlight, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {Row} from '../../../core/components/Primitives';
import {RatingSummary} from '../../../core/components/RatingSummary';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {formatString} from '../../../core/functions/format-string';
import {getChatRoomIdentifier} from '../../../core/functions/get-chat-room-identifier';
import {
	getCredit,
	mapCollectionToCredit,
} from '../../../core/functions/get-credit';
import {getModuleId} from '../../../core/functions/get-module-id';
import {getNewestSemesterFromSearchResult} from '../../../core/functions/get-newest-semester-from-search-result';
import {getPassedHue} from '../../../core/functions/get-passed-hue';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {hapticFeedback} from '../../../core/functions/HapticFeedback';
import {makeModuleCollection} from '../../../core/functions/make-module-collection';
import renderModuleType from '../../../core/functions/render-module-type';
import {globalStyles} from '../../../core/functions/styles';
import {truthy} from '../../../core/functions/truthy';
import {uiKit} from '../../../core/functions/ui-kit';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {translate} from '../../../core/functions/uzh-faculty';
import {humanToPeriod} from '../../../core/functions/uzh-period';
import {AppLanguage} from '../../../core/models/app-language';
import {CreditConfig, Institution} from '../../../core/models/credit';
import {Department} from '../../../core/models/eth-departments';
import {CourseCode, GradStatsSummary} from '../../../core/models/module';
import {UZHFaculty} from '../../../core/models/uzh-faculties';
import rawStrings from '../../../core/raw-strings';
import {ApiResponse} from '../../../core/reducers/api';
import {addModules} from '../../../core/reducers/moduleCollection';
import {subscribeToChannelsAction} from '../../../core/reducers/notifications';
import {AlgoliaCreditResult} from '../../../core/types/algolia-range';
import {formatCourseCode} from '../api/format-course-code';
import {getConfig} from '../api/get-config';
import {getCreditsFromResult} from '../api/get-credits-from-result';
import {getSemesterFromResult} from '../api/get-semester-from-result';
import {isDeviceRegistered} from '../api/is-device-registered';
import {ResultContainer, ResultSubtitle, ResultTitle} from './ResultLayout';

const Container = styled(ResultContainer)<{
	config?: CreditConfig;
	inline: boolean;
}>`
	flex-direction: row;
	${(props) =>
		props.inline
			? `
		border-width: 0px;
		background-color: transparent;
	`
			: null};
`;

const Touchable = styled(TouchableHighlight)`
	padding-horizontal: 10px;
	border-radius: 20px;
	border-width: 2px;
	border-color: ${(props) => transparentize(0.7, props.theme.BLUE_TINT)};
	padding-vertical: 4px;
`;

const Left = styled(View)`
	flex: 1;
`;

const Title = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
	font-weight: bold;
	font-size: 12px;
`;

const SubtitleRow = styled(View)`
	display: flex;
	flex-direction: row;
	margin-top: 2px;
	align-items: center;
`;

const DividerText = styled(Text)`
	font-size: 12px;
	color: gray;
`;

const ButtonIcon = styled(Image)<{added: boolean}>`
	tint-color: ${(props) => lighten(0.15, props.theme.BLUE_TINT)};
	height: 20px;
	width: 20px;
	margin-right: ${(props) => (props.added ? 5 : 0)}px;
`;

const ButtonLabel = styled(Text)`
	font-weight: bold;
	font-size: 13px;
	color: ${(props) => props.theme.BLUE_TINT};
`;

const HSpacer = styled(View)`
	width: 6px;
`;

const VSpacer = styled(View)`
	height: 6px;
`;

const ButtonRow = styled(Row)`
	align-items: center;
`;

const shouldDisplayCourseCode = (
	courseCode: CourseCode | null,
	university: Institution
) => {
	if (!courseCode) {
		return false;
	}

	return Boolean(formatCourseCode(courseCode, university));
};

const renderDepartment = (departments?: Department[]) => {
	if (!departments) {
		return null;
	}

	if (departments.length < 3) {
		return departments.join(', ');
	}

	return departments[0] + ', ' + departments[1] + ', ...';
};

const renderRating = (
	gradeStatistics: GradStatsSummary,
	language: AppLanguage
) => {
	if (!gradeStatistics || !gradeStatistics.count) {
		return null;
	}

	const {passed, count} = gradeStatistics;
	const renderPercentage = () => {
		return String(Math.round(((passed as number) / count) * 100));
	};

	const shade = (passed as number) / count;
	return (
		<View>
			<Text style={{fontSize: 12, color: getPassedHue(shade)}}>
				{formatString(rawStrings.PERCENTAGE_PASS[language], renderPercentage())}
			</Text>
		</View>
	);
};

export const SearchResult: React.FC<{
	result: AlgoliaCreditResult | Partial<ApiResponse>;
	inline?: boolean;
}> = ({result, inline = false}) => {
	const credit = useAppState((state) =>
		getCredit(
			state,
			result.uni_identifier as string,
			getSemesterFromResult(result),
			result.university
		)
	);
	const token = useAppState((state) => getUserHash(state, null));

	const appearance = useAppearance();
	const language = useLanguage();
	const config = useMemo(() => getConfig(credit.status, language, appearance), [
		appearance,
		credit.status,
		language,
	]);
	const added = config && config.status !== 'NOT_BOOKED';
	const navigation = useNavigation();
	const dispatch = useDispatch();
	const hasSystemPermission = useAppState(
		(state) => state.notifications.permissions?.alert
	);
	const deviceRegistered = useAppState((state) => isDeviceRegistered(state));
	const notificationsAreEnabled = hasSystemPermission && deviceRegistered;

	const onPress = useCallback(() => {
		const customModule = makeModuleCollection({
			uni_identifier: result.uni_identifier as string,
			university: result.university as Institution,
			period: humanToPeriod(getSemesterFromResult(result)) as number,
			name: result.name as string,
			short_name: result.short_name as string,
			credits_worth: getCreditsFromResult(result),
		});

		dispatch(addModules([customModule]));

		const creditToAdd = mapCollectionToCredit(customModule);
		const moduleId = getModuleId(creditToAdd);

		if (notificationsAreEnabled && moduleId) {
			dispatch(
				subscribeToChannelsAction(token, [
					getChatRoomIdentifier(
						moduleId,
						CreditHelpers.getInstitution(creditToAdd)
					),
				])
			);
		}

		navigation.navigate('CreditConfiguration', {
			credit: creditToAdd,
			showAddedIndicator: !added,
		});
		hapticFeedback();
		Keyboard.dismiss();
	}, [added, dispatch, navigation, notificationsAreEnabled, result, token]);
	const underlayColor = useMemo(
		() => transparentize(0.7, appearance.BLUE_TINT),
		[appearance.BLUE_TINT]
	);

	const translateTitle =
		result?.translatedNames?.find((r) => r.language === language)?.value ??
		result.short_name;

	const left = (
		<Left>
			{shouldDisplayCourseCode(
				'courseCode' in result ? (result.courseCode as CourseCode) : null,
				result.university as Institution
			) ? (
				<Title>
					{formatCourseCode(
						(result as ApiResponse).courseCode as CourseCode,
						result.university as Institution
					)}
				</Title>
			) : null}
			<ResultTitle style={[uiKit.subheadEmphasized, {color: appearance.TITLE}]}>
				{translateTitle}
			</ResultTitle>
			<ResultSubtitle>
				{[
					result
						? getNewestSemesterFromSearchResult(result as AlgoliaCreditResult)
						: null,
					'semesters' in result
						? sortBy(result.semesters, (s) => 0 - s.period)[0].period_human
						: null,
					translate(result.faculty as UZHFaculty, language),
					renderDepartment(result.departments as Department[]),
					'users' in result
						? `${Number(result.users).toLocaleString().replace(/\./g, "'")} ${
								rawStrings.APP_USERS[language]
						  }`
						: null,
					'userCount' in result && result.userCount?.all
						? `${Number(result.userCount?.all)
								.toLocaleString()
								.replace(/\./g, "'")} ${rawStrings.APP_USERS[language]}`
						: null,
				]
					.filter(truthy)
					.join(' • ')}
			</ResultSubtitle>
			<ResultSubtitle>
				{[
					renderModuleType(result.type, language),
					getCreditsFromResult(result) + ' ECTS',
				]
					.filter(truthy)
					.join(' • ')}
			</ResultSubtitle>

			<VSpacer />

			<Row>
				{getSemesterFromResult(result) ? (
					<>
						<Touchable onPress={onPress} underlayColor={underlayColor}>
							<ButtonRow>
								<ButtonIcon
									added={added}
									source={
										added
											? require('../assets/edit.png')
											: require('../assets/add.png')
									}
								/>
								<ButtonLabel>
									{added
										? rawStrings.EDIT[language]
										: rawStrings.ADD_TO_MODULES[language]}
								</ButtonLabel>
							</ButtonRow>
						</Touchable>
						<HSpacer />
					</>
				) : null}
				<SubtitleRow>
					<RatingSummary result={result} />
					{result.gradeStatistics?.count &&
					result.ratingSummary &&
					result.ratingSummary.average ? (
						<DividerText> • </DividerText>
					) : null}
					{renderRating(result.gradeStatistics as GradStatsSummary, language)}
				</SubtitleRow>
				<View style={globalStyles.flex1} />
			</Row>
		</Left>
	);
	return (
		<Container config={config} inline={inline}>
			{left}
		</Container>
	);
};
