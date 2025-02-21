import {
	SetSeriesConfig,
	SetSpecificSerieConfig,
	SET_SERIES_CONFIG,
	SET_SPECIFIC_SERIE_CONFIG,
} from '../actions/seriesConfig';
import {getUniqueIdentifier} from '../functions/get-unique-identifier';
import {SeriesConfigType} from '../types/serie-config';

export type SeriesConfigState = SeriesConfigType;

export const seriesConfig = (
	state: SeriesConfigType = {},
	action: SetSeriesConfig | SetSpecificSerieConfig
): SeriesConfigType => {
	switch (action.type) {
		case SET_SERIES_CONFIG:
			return action.seriesConfig || {};
		case SET_SPECIFIC_SERIE_CONFIG:
			return {
				...state,
				[getUniqueIdentifier(action.credit, true)]: action.config,
			};
		default:
			return state;
	}
};
