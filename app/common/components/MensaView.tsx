import isToday from 'date-fns/isToday';
import React, {useEffect} from 'react';
import {FlatList, Platform, View} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import {createSelector} from 'reselect';
import {EmptyView} from '../../../core/components/EmptyView';
import {FullScreenError} from '../../../core/components/FullScreenError';
import {UnifiedProgress} from '../../../core/components/UnifiedProgress';
import {addImpression} from '../../../core/functions/api';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {mensaMenuVisible} from '../../../core/functions/mensa-menu-visible';
import OpeningHours from '../../../core/functions/opening-hours';
import {
	MensaInject,
	selectImpression,
	selectMensa,
} from '../../../core/functions/selectors';
import {globalStyles} from '../../../core/functions/styles';
import {
	AppearanceMap,
	getAppearanceMap,
	useAppearance,
} from '../../../core/functions/use-appearance';
import {AppLanguage} from '../../../core/models/app-language';
import {Institution} from '../../../core/models/credit';
import {Impression, MENSA_VIEW} from '../../../core/models/impression-type';
import rawStrings from '../../../core/raw-strings';
import {loadMensa} from '../../../core/reducers/food';
import {AppState} from '../../../core/types/app-state';
import {MensaApiResponse} from '../../../core/types/food';
import MensaDayPicker from './MensaDayPicker';
import {MensaFilters} from './MensaFilters';
import {MenuPlan} from './MenuPlan';

const MensaViewUnconnected: React.FC<Props> = (props) => {
	const appearance = useAppearance();
	const dispatch = useDispatch();

	const {
		institution,
		direction,
		token,
		language,
		currentMensa,
		currentDay,
		mensaPlan,
		resolvedDate,
		nutrition,
		pricing,
		priceRange,
		energyRange,
		allergenFilter,
		showCalories,
		nowOpenFilter,
		filterState,
	} = props;

	useEffect(() => {
		if (!mensaPlan.data && !mensaPlan.loading && !mensaPlan.error) {
			dispatch(
				loadMensa(
					currentMensa.id,
					currentDay,
					currentMensa.institution || institution,
					language,
					token
				)
			);
		}
	}, [
		currentDay,
		currentMensa.id,
		currentMensa.institution,
		dispatch,
		institution,
		language,
		token,
		mensaPlan,
	]);

	useEffect(() => {
		const impression: Omit<Impression, 'date'> = {
			institution,
			identifier: token,
			platform: Platform.OS,
			content: MENSA_VIEW,
			direction,
			language,
		};
		addImpression(impression)
			.then(() => {
				console.log('Mensa View Impression', impression);
			})
			.catch((err) => {
				console.log('Could not add impression', err);
			});
	}, [direction, institution, language, token]);

	const filtered = React.useMemo(() => {
		if (!mensaPlan.data) {
			return null;
		}

		return mensaPlan.data
			.filter((d) => {
				return d.tags.some((tag) => filterState[tag.key] !== false);
			})
			.filter((m) => m.plan.length > 0)
			.filter((p) => {
				if (!nowOpenFilter) {
					return true;
				}

				if (!p.openingHours) {
					return false;
				}

				return new OpeningHours(p.openingHours, language).open;
			})
			.filter((m) => {
				return m.plan.some((p) =>
					mensaMenuVisible(p, {
						nutrition,
						pricing,
						priceRange,
						energyRange,
						allergenFilter,
						calorieFilter: showCalories,
					})
				);
			});
	}, [
		allergenFilter,
		energyRange,
		filterState,
		language,
		mensaPlan.data,
		nowOpenFilter,
		nutrition,
		priceRange,
		pricing,
		showCalories,
	]);

	const renderItem = React.useCallback(
		// eslint-disable-next-line react/no-unused-prop-types
		({item}: {item: MensaApiResponse}) => {
			return (
				<MenuPlan
					mensaInstitution={currentMensa.institution}
					menu={item}
					isToday={isToday(new Date(resolvedDate(currentDay) as number))}
					mensaId={currentMensa.id}
				/>
			);
		},
		[currentDay, currentMensa.id, currentMensa.institution, resolvedDate]
	);

	return (
		<View style={globalStyles.flex1}>
			<MensaDayPicker />
			{mensaPlan.loading ? (
				<View style={{flex: 1, backgroundColor: appearance.BACKGROUND}}>
					<UnifiedProgress />
				</View>
			) : mensaPlan.error ? (
				<FullScreenError error={mensaPlan.error} />
			) : (
				<View style={globalStyles.flex1}>
					<MensaFilters />
					{!filtered || filtered.length === 0 ? (
						<EmptyView
							icon={require('../assets/food.png')}
							text={rawStrings.NO_OPEN_MENSI_TODAY[language]}
						/>
					) : (
						<FlatList
							initialNumToRender={2}
							style={{
								backgroundColor: appearance.INTERSTITIAL_BACKGROUND,
							}}
							data={filtered}
							renderItem={renderItem}
							keyExtractor={(item: MensaApiResponse) => item.slug}
						/>
					)}
				</View>
			)}
		</View>
	);
};

type Props = {
	institution: Institution;
	direction: string[] | null;
	token: string;
	language: AppLanguage;
	appearance: AppearanceMap;
	showCalories: boolean;
} & MensaInject;

const mapStateToProps = createSelector(
	selectImpression,
	selectMensa,
	(state: AppState) => getUserHash(state, null),
	(state: AppState) => state.language.selectedLanguage,
	(state: AppState) => getAppearanceMap(state.appearance),
	(state: AppState) => state.food.showCalories,
	(impression, mensa, token, language, appearance, showCalories) => ({
		...impression,
		...mensa,
		token,
		language,
		appearance,
		showCalories,
		direction: null,
	})
);

export const MensaView = connect(mapStateToProps)(MensaViewUnconnected);
