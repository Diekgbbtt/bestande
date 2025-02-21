import memoize from 'lodash/memoize';
import {Colors} from '../../../core/functions/Colors';
import {AppearanceMap} from '../../../core/functions/use-appearance';
import {AppLanguage} from '../../../core/models/app-language';
import {CreditConfig, CreditStatus} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';

export const getConfig = memoize(
	(
		status: CreditStatus,
		language: AppLanguage,
		appearanceMap: AppearanceMap
	): CreditConfig => {
		if (status === 'BOOKED') {
			return {
				status,
				label: rawStrings.ADDED[language],
				color: appearanceMap.BLUE_TINT,
				icon: require('../assets/baseline_more_vert_black_18dp.png'),
			};
		}

 if (status === 'DESELECTED') {
			return {
				status,
				label: rawStrings.DESELECTED[language],
				color: Colors.Orange,
				icon: require('../assets/baseline_more_vert_black_18dp.png'),
			};
		}

 if (status === 'PASSED') {
			return {
				status,
				label: rawStrings.PASSED[language],
				color: Colors.Green,
				icon: require('../assets/baseline_more_vert_black_18dp.png'),
			};
		}

 if (status === 'FAILED') {
			return {
				status,
				label: rawStrings.FAILED[language],
				color: Colors.Red,
				icon: require('../assets/baseline_more_vert_black_18dp.png'),
			};
		}

 if (status === 'CONTINUE') {
			return {
				status,
				label: rawStrings.CONTINUE[language],
				color: Colors.Purple,
				icon: require('../assets/baseline_more_vert_black_18dp.png'),
			};
		}

 if (status === 'ADDED') {
			return {
				status,
				label: rawStrings.ADDED[language],
				color: appearanceMap.BLUE_TINT,
				icon: require('../assets/baseline_more_vert_black_18dp.png'),
			};
		}

 if (status === 'NOT_BOOKED') {
			return {
				status,
				label: rawStrings.ADD_TO_MODULES[language],
				color: appearanceMap.BLUE_TINT,
				icon: require('../assets/add.png'),
			};
		}

		return {
			status: 'UNKNOWN_STATUS',
			label: rawStrings.UNKNOWN_STATUS[language],
			color: '#cccccc',
			icon: null,
		};
	},
	(status: CreditStatus, language: AppLanguage, appearanceMap: AppearanceMap) =>
		status + language + appearanceMap.BACKGROUND
);
