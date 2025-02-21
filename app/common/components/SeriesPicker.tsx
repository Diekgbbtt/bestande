import {RouteProp, useRoute} from '@react-navigation/native';
import React, {Fragment} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import {useDispatch} from 'react-redux';
import {setSpecificConfig} from '../../../core/actions/seriesConfig';
import {CheckItem, Label, VSpace} from '../../../core/components/Base';
import {RN5Routes} from '../../../core/data/rn5-routes';
import {getSchedule} from '../../../core/functions/get-next-event-from-credit';
import renderModuleType from '../../../core/functions/render-module-type';
import {globalStyles} from '../../../core/functions/styles';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {Credit} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {EventSerieWithEventsAndPeople} from '../../../core/types/schedule';
import {getSeriesConfig} from '../api/get-series-config';
import {Header} from './Header';

export const SeriesPicker: React.FC<{
	credit: Credit;
	semester: string;
}> = (props) => {
	const appearance = useAppearance();
	const dispatch = useDispatch();
	const route = useRoute<RouteProp<RN5Routes, 'PickSeriesView'>>();
	const credit = props.credit || route.params.credit;
	const semester = props.semester || route.params.semester;
	const schedule = useAppState((state) =>
		getSchedule(state.schedule, credit, semester)
	);
	const seriesConfig = useAppState((state) =>
		getSeriesConfig(state, credit, semester)
	);

	const language = useLanguage();

	const toggleSerie = React.useCallback(
		(url: string) => {
			const config = {
				...seriesConfig,
				[url]: !seriesConfig[url],
			};
			dispatch(setSpecificConfig(credit, config));
		},
		[seriesConfig, credit, dispatch]
	);

	const renderSerie = React.useCallback(
		(serie: EventSerieWithEventsAndPeople) => {
			const shouldBeChecked = seriesConfig[`e-${serie.id}.termine.html`];
			return (
				<Fragment key={String(serie.id)}>
					<CheckItem
						small
						active={shouldBeChecked}
						onPress={() => toggleSerie(`e-${serie.id}.termine.html`)}
					>
						<View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
							<View style={globalStyles.flex1}>
								<Label
									style={
										shouldBeChecked
											? {
													color: 'white',
											  }
											: {color: appearance.TITLE}
									}
								>
									{renderModuleType(serie.category, language)}
								</Label>
								<Text
									style={[
										{marginTop: 2},
										shouldBeChecked
											? {color: 'white'}
											: {color: appearance.SUBTITLE},
									]}
								>
									{serie.time_label}
								</Text>
								{serie.comments ? (
									<Text
										style={[
											{marginTop: 2},
											shouldBeChecked
												? {color: 'white'}
												: {color: appearance.SUBTITLE},
										]}
									>
										{serie.comments}
									</Text>
								) : null}
							</View>
						</View>
					</CheckItem>
					<VSpace key="space" />
				</Fragment>
			);
		},
		[appearance, language, seriesConfig, toggleSerie]
	);

	if (schedule.loading) {
		return <Header text="Loading" />;
	}

	if (!schedule.schedule) {
		return (
			<Text style={{color: appearance.TITLE}}>
				{rawStrings.NO_SERIES_TO_PICK[language]}
			</Text>
		);
	}

	return (
		<View>
			{schedule.schedule.length === 0 ? (
				<Text>{rawStrings.NO_SERIES_TO_PICK[language]}</Text>
			) : null}
			{schedule.schedule.map((serie) => renderSerie(serie))}
		</View>
	);
};
