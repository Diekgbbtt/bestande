import {SeriesConfig} from '../functions/SeriesConfig';
import {Credit} from '../models/credit';
import {SerieConfig, SeriesConfigType} from '../types/serie-config';

export const SET_SERIES_CONFIG = 'SET_SERIES_CONFIG';
export const SET_SPECIFIC_SERIE_CONFIG = 'SET_SPECIFIC_SERIE_CONFIG';

export type SetSeriesConfig = {
	type: 'SET_SERIES_CONFIG';
	seriesConfig: SeriesConfigType | null;
};

export function setSeriesConfig(
	seriesConfig: SeriesConfigType | null
): SetSeriesConfig {
	return {
		type: SET_SERIES_CONFIG,
		seriesConfig,
	};
}

export type SetSpecificSerieConfig = {
	type: 'SET_SPECIFIC_SERIE_CONFIG';
	credit: Credit;
	config: SerieConfig;
};

function setConfigForSerie(
	credit: Credit,
	config: SerieConfig
): SetSpecificSerieConfig {
	return {
		type: SET_SPECIFIC_SERIE_CONFIG,
		credit,
		config,
	};
}

export function setSpecificConfig(credit: Credit, config: SerieConfig) {
	return async (
		dispatch: (arg0: {
			type: string;
			credit: Credit;
			config: SerieConfig;
		}) => void
	) => {
		dispatch(setConfigForSerie(credit, config));
		await SeriesConfig.setSerieConfig(credit, config);
	};
}
