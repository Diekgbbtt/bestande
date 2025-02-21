import React, {useEffect} from 'react';
import {Platform, ScrollView, TouchableHighlight, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {HIDE_BADGE} from '../../../core/actions/promotions';
import {UnifiedProgress} from '../../../core/components/UnifiedProgress';
import {addImpression} from '../../../core/functions/api';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {EventHelpers} from '../../../core/functions/EventHelpers';
import {formatString} from '../../../core/functions/format-string';
import {getUniqueIdentifier} from '../../../core/functions/get-unique-identifier';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {schedulecacheKey} from '../../../core/functions/schedule-cache-key';
import {SeriesConfig} from '../../../core/functions/SeriesConfig';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import {TIMETABLE} from '../../../core/models/impression-type';
import {PROMOTED_EVENT} from '../../../core/models/promotion-type';
import rawStrings from '../../../core/raw-strings';
import {parsePromotions} from '../../../core/reducers/promotions';
import {getSchedule} from '../actions/schedule';
import {getTimeTableData} from '../api/timetable-data';
import {TimeTableGrid} from './TimeTableGrid';
import TimeTableWeek from './TimeTableWeek';
import {Warning} from './Warning';

const TimeTableViewContent = () => {
	const seriesConfig = useAppState((state) => state.seriesConfig);
	const appearance = useAppearance();
	const institution = useAppState((state) => state.institution.institution);
	const {
		semester,
		bookedModules,
		schedule,
		currentWeek,
		events,
	} = useAppState((state) => getTimeTableData(state));
	const week = useAppState(
		(state) => state.timetable.weeks[semester] || currentWeek
	);
	const dayRange = EventHelpers.getDayRange(week);
	const eventsThisWeek = events.filter(({event}) =>
		EventHelpers.eventIsInDayRange(event, dayRange)
	);
	const nonLoadedModules = useAppState((state) =>
		bookedModules.filter(
			(c) =>
				!state.schedule[schedulecacheKey(c, semester)] ||
				!state.schedule[schedulecacheKey(c, semester)].schedule
		)
	);
	const language = useLanguage();
	const identifier = useAppState((state) => getUserHash(state, null));
	const promotions = useAppState((state) =>
		parsePromotions(state.promotions).filter((p) => p.type === PROMOTED_EVENT)
	);
	const promotionsThisWeek = promotions.filter((p) =>
		EventHelpers.eventIsInDayRange(p, dayRange)
	);
	const dispatch = useDispatch();
	const navigation = useNavigationInNative();
	useEffect(() => {
		nonLoadedModules.forEach((credit) => {
			dispatch(
				getSchedule(credit, CreditHelpers.getSemester(credit) as string)
			);
		});
	}, [semester, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps
	useEffect(() => {
		addImpression({
			institution,
			identifier,
			content: TIMETABLE,
			platform: Platform.OS,
			language,
		})
			.then((impression) => {
				console.log('Added timetable impression', impression);
			})
			.catch((err) => {
				console.log('Could not add timetable impression', err);
			});
	}, [institution, language, identifier]);
	useEffect(() => {
		dispatch({type: HIDE_BADGE});
	}, [dispatch]);
	const wholeScheduleLoaded = schedule.every(Boolean);
	if (!wholeScheduleLoaded) {
		return (
			<View>
				<View style={{marginTop: 20}}>
					<UnifiedProgress text="Lade Veranstaltungen..." />
				</View>
			</View>
		);
	}

	return (
		<ScrollView>
			{schedule.map((module) => {
				const {series} = module;
				const config = seriesConfig[getUniqueIdentifier(module.credit, true)];
				if (!SeriesConfig.shouldShowWarning(config, series)) {
					return false;
				}

				const label = formatString(
					rawStrings.SELECT_SERIES_FIRST[language],
					module.credit.short_name
				);
				return (
					<TouchableHighlight
						key={getUniqueIdentifier(module.credit, true)}
						onPress={() => {
							navigation.navigate('PickSeriesView', {
								credit: module.credit,
								semester,
							});
						}}
					>
						<View>
							<Warning label={label} />
						</View>
					</TouchableHighlight>
				);
			})}
			<View style={{backgroundColor: appearance.BACKGROUND}}>
				<TimeTableGrid hasPromotions={promotionsThisWeek.length > 0} />
				<ScrollView horizontal>
					<TimeTableWeek
						events={eventsThisWeek}
						dayRange={dayRange}
						promotions={promotionsThisWeek}
						semester={semester}
					/>
				</ScrollView>
			</View>
		</ScrollView>
	);
};

export default TimeTableViewContent;
