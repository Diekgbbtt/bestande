import memoize from 'lodash/memoize';
import {AppearanceMap} from '../../../core/functions/use-appearance';
import {AppLanguage} from '../../../core/models/app-language';
import {Credit} from '../../../core/models/credit';
import {getConfig} from './get-config';

export const isCreditActive = memoize(
	(
		credit: Credit,
		language: AppLanguage,
		appearanceMap: AppearanceMap
	): boolean => {
		const config = getConfig(credit.status, language, appearanceMap);
		return config.status === 'BOOKED' || config.status === 'ADDED';
	}
);
