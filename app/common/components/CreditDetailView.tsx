import {RouteProp, useRoute} from '@react-navigation/native';
import last from 'lodash/last';
import sortBy from 'lodash/sortBy';
import React, {useCallback, useEffect, useState} from 'react';
import {Platform, ScrollView, View} from 'react-native';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {fetchModuleDetails} from '../../../core/actions/api';
import {makeRequest} from '../../../core/actions/grade-statistics';
import {getRating} from '../../../core/actions/ratings';
import {TimetableTab} from '../../../core/components/CreditTimetable/TimetableTab';
import {FullScreenError} from '../../../core/components/FullScreenError';
import {RelatedModules} from '../../../core/components/RelatedModules';
import {UnifiedProgress} from '../../../core/components/UnifiedProgress';
import {RN5Routes} from '../../../core/data/rn5-routes';
import {addImpression} from '../../../core/functions/api';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {TabIndex} from '../../../core/functions/get-chat-room-identifier';
import {getCredit} from '../../../core/functions/get-credit';
import {getModuleId} from '../../../core/functions/get-module-id';
import {getRatingsStateForModule} from '../../../core/functions/get-ratings-state-for-module';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {globalStyles} from '../../../core/functions/styles';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {Credit, Institution} from '../../../core/models/credit';
import {CREDIT_DETAIL_VIEW} from '../../../core/models/impression-type';
import {UZH} from '../../../core/models/university';
import {ApiResponse, SemesterResponse} from '../../../core/reducers/api';
import {initialGradeState} from '../../../core/reducers/grade-statistics';
import {reduceSchedule} from '../../../core/reducers/schedule';
import {getSchedule} from '../actions/schedule';
import {getApiResponse} from '../api/get-api-response';
import {isCreditActive} from '../api/is-credit-active';
import {Chat} from './Chat';
import {CreditDetailViewTabs} from './CreditDetailViewTabs';
import CreditFiles from './CreditFiles';
import {CreditInfoTab} from './CreditInfoTab';
import {CreditRatings} from './CreditRatings';
import {StatisticTab} from './StatisticTab';

const Scroller = styled(ScrollView)`
	flex: 1;
	background-color: ${(props) => props.theme.BACKGROUND};
`;

const TabContent = (props: {
	index: string;
	moduleId: string;
	semester: string;
	credit: Credit;
	newestSemester: string | null;
}) => {
	const apiResponse = useAppState((state) =>
		getApiResponse(
			state,
			CreditHelpers.getInstitution(props.credit),
			props.moduleId
		)
	);

	const gradeStatistics = useAppState(
		(state) =>
			state.multiGradeStatistics[
				props.credit.institution || state.institution.institution
			][props.moduleId] || initialGradeState
	);

	if (props.index === 'info') {
		return (
			<CreditInfoTab
				semester={props.semester}
				moduleId={props.moduleId}
				credit={props.credit}
			/>
		);
	}

	if (props.index === 'statistics') {
		return (
			<StatisticTab
				credit={props.credit}
				moduleId={props.moduleId}
				gradeStatistics={gradeStatistics}
				newestSemester={props.newestSemester}
			/>
		);
	}

	if (props.index === 'timetable') {
		return (
			<TimetableTab
				institution={props.credit.institution as Institution}
				moduleId={props.moduleId}
				semester={props.semester}
			/>
		);
	}

	if (props.index === 'ratings') {
		return (
			<CreditRatings
				credit={props.credit}
				uni_identifier={props.moduleId}
				institution={CreditHelpers.getInstitution(props.credit)}
				course={apiResponse.details as ApiResponse}
			/>
		);
	}

	if (props.index === 'related') {
		return (
			<Scroller>
				<RelatedModules
					totalCount={apiResponse?.details?.userCount?.all as number}
					name={props.credit.short_name}
					university={props.credit.institution as Institution}
					moduleId={props.moduleId}
				/>
			</Scroller>
		);
	}

	if (props.index === 'files') {
		return <CreditFiles credit={props.credit} />;
	}

	return null;
};

export const CreditDetailViewContent = () => {
	const appearance = useAppearance();
	const {params} = useRoute<RouteProp<RN5Routes, 'CreditDetailView'>>();
	const {
		institution,
		moduleId,
		semester: semesterProp,
		chatFirst: chatFirstParam,
	} = params;

	const apiResponse = useAppState((state) =>
		getApiResponse(state, institution, moduleId)
	);
	const {semester: selectedSemester} = apiResponse;
	const sorted = apiResponse.details
		? sortBy(apiResponse.details.semesters, (s) => s.period)
		: null;
	const lastSemester = sorted ? (last(sorted) as SemesterResponse) : null;
	const newestSemester = lastSemester ? lastSemester.period_human : null;
	const semester = selectedSemester || semesterProp || newestSemester;
	const credit = useAppState((state) =>
		getCredit(state, moduleId, semester, institution)
	);
	const token = useAppState((state) => getUserHash(state, null));

	const language = useLanguage();
	const [chatFirst] = useState(
		chatFirstParam || isCreditActive(credit, language, appearance)
	);
	const [index, setIndex] = useState(chatFirst ? 'chat' : 'info');

	useEffect(() => {
		setIndex(chatFirst ? 'chat' : 'info');
	}, [params.moduleId, params.institution, chatFirst]);

	const {loading, error} = apiResponse;
	const dispatch = useDispatch();
	const identifier = useAppState((state) => getUserHash(state, null));
	const ratings = useAppState((state) =>
		getRatingsStateForModule(
			state,
			credit.institution as Institution,
			moduleId,
			'best'
		)
	);

	const update = useCallback(() => {
		dispatch(fetchModuleDetails(credit.institution || UZH, moduleId));
	}, [dispatch, credit.institution, moduleId]);
	const schedule = useAppState((state) =>
		semester ? reduceSchedule(state, moduleId, semester, institution) : null
	);

	useEffect(() => {
		if (!schedule || !schedule.schedule) {
			dispatch(getSchedule(credit, semester as string));
		}

		if (!apiResponse.details) {
			update();
		}

		// TODO: use same start for sortOption than in CreditRatings
		if (!ratings.data && !ratings.loading) {
			dispatch(
				getRating({
					uni_identifier: moduleId,
					institution: CreditHelpers.getInstitution(credit),
					sortOption: 'best',
					token,
				})
			);
		}

		addImpression({
			institution: CreditHelpers.getInstitution(credit),
			identifier,
			platform: Platform.OS,
			content: CREDIT_DETAIL_VIEW,
			content_id: getModuleId(credit) ?? undefined,
			language,
		})
			.then((impression) => {
				console.log('Credit Detail View Impression added', impression);
			})
			.catch((err: Error) => {
				console.log('Could not add Credit Details impression', err);
			});
	}, [dispatch, credit.uni_identifier, semester, update]); // eslint-disable-line react-hooks/exhaustive-deps

	const gradeStatistics = useAppState(
		(state) =>
			state.multiGradeStatistics[
				credit.institution || state.institution.institution
			][moduleId] || initialGradeState
	);
	React.useEffect(() => {
		if (!gradeStatistics.stats) {
			dispatch(makeRequest(CreditHelpers.getInstitution(credit), moduleId));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, gradeStatistics.stats]);
	useEffect(() => {
		update();
	}, [moduleId, institution, update]);

	const goToTab = React.useCallback((tab: TabIndex) => setIndex(tab), []);

	if (error) {
		return <FullScreenError error={error} />;
	}

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: appearance.BACKGROUND,
				}}
			>
				<UnifiedProgress />
			</View>
		);
	}

	const content = (
		<View style={globalStyles.flex1}>
			<CreditDetailViewTabs
				setIndex={setIndex}
				index={index}
				chatFirst={chatFirst}
				semester={semester}
				moduleId={moduleId}
				credit={credit}
			/>
			<View style={globalStyles.flex1}>
				<TabContent
					credit={credit}
					index={index}
					moduleId={moduleId}
					semester={semester as string}
					newestSemester={newestSemester}
				/>
			</View>
		</View>
	);
	if (index === 'chat') {
		return (
			<View style={globalStyles.flex1}>
				<View>
					<CreditDetailViewTabs
						setIndex={setIndex}
						index={index}
						chatFirst={chatFirst}
						semester={semester}
						moduleId={moduleId}
						credit={credit}
					/>
				</View>
				<View style={globalStyles.flex1}>
					<Chat
						uni_identifier={getModuleId(credit) as string}
						university={CreditHelpers.getInstitution(credit)}
						credit={credit}
						goToTab={goToTab}
					/>
				</View>
			</View>
		);
	}

	return <View style={globalStyles.flex1}>{content}</View>;
};
