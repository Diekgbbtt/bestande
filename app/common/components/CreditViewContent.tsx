import {useScrollToTop} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Platform, SectionList, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {addImpression} from '../../../core/functions/api';
import {CreditHelpers, ViewGroup} from '../../../core/functions/CreditHelpers';
import {getVisibleCredits} from '../../../core/functions/Credits';
import {doesCountTowardsCredit} from '../../../core/functions/does-count-towards-credit';
import {initialScheduleState} from '../../../core/functions/get-next-event-from-credit';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {renderSemester} from '../../../core/functions/render-semester';
import {schedulecacheKey} from '../../../core/functions/schedule-cache-key';
import {globalStyles} from '../../../core/functions/styles';
import {truthy} from '../../../core/functions/truthy';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {Credit} from '../../../core/models/credit';
import {currentPeriod} from '../../../core/models/current-period';
import {HOMEPAGE} from '../../../core/models/impression-type';
import rawStrings from '../../../core/raw-strings';
import {getSchedules} from '../actions/schedule';
import {isCreditBooked} from '../api/is-credit-booked';
import {AddCreditsReminder} from './AddCreditsReminder';
import {CreditCellWithOption} from './CreditCellWithOption';
import {CreditViewHeader} from './CreditViewHeader';
import {CreditViewInterstitial} from './CreditViewInterstitial';
import {ListHeader} from './ListHeader';
import {UrgentBanner} from './UrgentBanner';
import {WelcomeScreen} from './WelcomeScreen';

type Section = {
	type: string;
	key: string;
	data: {
		type: string;
		key: string;
	}[];
};

export const CreditViewContent = () => {
	const promotions = useAppState((state) => state.promotions.promotions);
	const promotionIds = Object.keys(promotions);
	const identifier = useAppState((state) => getUserHash(state, null));
	const dispatch = useDispatch();
	const credits = useAppState((state) => getVisibleCredits(state));
	const schedule = useAppState((state) => state.schedule);
	const seriesConfig = useAppState((state) => state.seriesConfig);
	const hiddenContent = useAppState((state) => state.hiddenContent);
	const language = useLanguage();
	const countsTowardsCredits = useAppState(
		(state) => state.countsTowardsCredits
	);
	const coronaInfo = useAppState((state) => state.corona.data?.mainViewBanner);
	const grouped = CreditHelpers.groupBySemester({
		credits,
		schedule,
		seriesConfig,
	});
	const institution = useAppState((state) => state.institution.institution);
	const appearance = useAppearance();
	useEffect(() => {
		addImpression({
			institution,
			identifier,
			content: HOMEPAGE,
			platform: Platform.OS,
			language,
		})
			.then((impression) => {
				console.log('Homepage View Impression added', impression);
			})
			.catch((err) => {
				console.log('Error adding Homepage view impression', err);
			});
	}, [identifier, institution, language]);

	const scheduleAtRenderTime = schedule;

	const ref = React.useRef(null);

	useScrollToTop(ref);

	const getSchedule = React.useCallback(
		(credit: Credit) => {
			const semester = CreditHelpers.getSemester(credit) as string;
			return (
				scheduleAtRenderTime[schedulecacheKey(credit, semester)] ||
				initialScheduleState
			);
		},
		[scheduleAtRenderTime]
	);
	// Fetch them at once - will also auto fetch but more performance
	useEffect(() => {
		const notLoadedSchedules = credits
			.filter((c) => isCreditBooked(c))
			.map((credit) => {
				const s = getSchedule(credit);
				return {schedule: s, credit};
			})
			.filter((s) => !s.schedule.loading && !s.schedule.schedule);
		if (notLoadedSchedules.length > 0) {
			const data: [Credit, string][] = notLoadedSchedules.map(({credit}) => {
				const hi: [Credit, string] = [
					credit,
					CreditHelpers.getSemester(credit) as string,
				];
				return hi;
			});
			dispatch(getSchedules(data));
		}
	}, [credits, dispatch, getSchedule]);
	const adHasTopPosition = promotionIds.some(
		(pId) => promotions[pId]?.data?.top_position
	);
	const precalculatedIndex = Math.min(
		grouped.length > 0 ? (grouped[0].data.length > 1 ? 1 : 2) : 0,
		grouped.length
	);
	const creditsInThisSemester = credits.some(
		(c) => CreditHelpers.getPeriod(c) === currentPeriod
	);
	const showAddCreditsBanner =
		!creditsInThisSemester &&
		!hiddenContent.includes(`add-credits-${currentPeriod}`);
	const calculatedIndex = showAddCreditsBanner
		? Math.min(1, precalculatedIndex)
		: precalculatedIndex;

	const interstitialIndex = adHasTopPosition ? 0 : calculatedIndex;
	const withInterstitial: (Section | ViewGroup)[] = [
		coronaInfo
			? {
					key: 'urgent-info',
					type: 'urgent-info',
					data: [
						{
							type: 'urgent-info',
							key: 'urgent-info',
						},
					],
			  }
			: null,
		{
			type: 'header',
			key: 'header',
			data: [
				{
					type: 'header',
					key: 'credit-header',
				},
			],
		},
		showAddCreditsBanner
			? {
					type: 'add-credits-reminder',
					key: 'add-credits-reminder',
					data: [
						{
							type: 'add-credits-reminder',
							key: 'add-credits-reminder',
						},
					],
			  }
			: null,
		...grouped.slice(0, interstitialIndex),
		{
			type: 'interstitial',
			key: 'interstitial',
			data: [
				{
					type: 'interstitial',
					key: 'interstitial',
				},
			],
		},
		...grouped.slice(interstitialIndex),
	].filter(truthy);
	if (credits.length === 0) {
		return <WelcomeScreen />;
	}

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: appearance.BACKGROUND,
			}}
		>
			<SectionList
				ref={ref}
				style={globalStyles.flex1}
				initialNumToRender={20}
				renderItem={({item}) => {
					if (item.type === 'urgent-info') {
						return (
							<UrgentBanner
								text={coronaInfo?.text[language] as string}
								link={coronaInfo?.link as string}
							/>
						);
					}

					if (item.type === 'interstitial') {
						return <CreditViewInterstitial key="interstitial" />;
					}

					if (item.type === 'header') {
						return <CreditViewHeader credits={credits} />;
					}

					if (item.type === 'add-credits-reminder') {
						return <AddCreditsReminder />;
					}

					return <CreditCellWithOption credit={(item as unknown) as Credit} />;
				}}
				renderSectionHeader={({section}) => {
					if (
						(section as Section).type === 'interstitial' ||
						(section as Section).type === 'header' ||
						(section as Section).type === 'urgent-info'
					) {
						return null;
					}

					if ((section as Section).type === 'add-credits-reminder') {
						return (
							<ListHeader>
								{renderSemester(currentPeriod, language) as string}
							</ListHeader>
						);
					}

					let planned = 0;
					let received = 0;
					section.data.forEach((item) => {
						const credit = (item as unknown) as Credit;
						if (isCreditBooked(credit)) {
							planned += Number(credit.credits_worth);
						} else {
							const counts = doesCountTowardsCredit(
								countsTowardsCredits,
								credit
							);
							if (counts) {
								received += Number(credit.credits_received);
							}
						}
					});
					const label =
						planned === 0
							? `${received} ECTS`
							: received === 0
							? `${planned} ECTS ${rawStrings.PLANNED[language]}`
							: `${received} ECTS + ${planned} ECTS ${rawStrings.PLANNED[language]}`;
					return (
						<ListHeader right={label}>
							{
								renderSemester(
									(section as ViewGroup).semester as string,
									language
								) as string
							}
						</ListHeader>
					);
				}}
				// @ts-expect-error
				sections={withInterstitial}
				stickySectionHeadersEnabled
			/>
		</View>
	);
};
