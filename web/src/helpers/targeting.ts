import md5 from 'md5';
import {PlatformOSType} from 'react-native';
import {AppLanguage} from '../../../core/models/app-language';
import {Institution} from '../../../core/models/credit';
import {ImpressionPlatform} from '../../../core/models/platform';
import {PromotionResponse} from '../../../core/models/promotion';
import {UZHFaculty} from '../../../core/models/uzh-faculties';

export type Profile = {
	identifier?: string;
	direction?: string[];
	faculty?: UZHFaculty;
	institution?: Institution;
	platform?: ImpressionPlatform;
	language?: AppLanguage;
};

export const makeInitialQuery = (profile?: Profile) => {
	if (!profile || profile.identifier !== md5('bestande')) {
		return {
			$or: [
				{live: true},
				{
					scheduled: true,
					scheduled_start: {$lt: Date.now()},
					scheduled_end: {$gt: Date.now()},
				},
			],
		};
	}

	return {};
};

const promotionMatchesProfile = (
	promotion: PromotionResponse,
	profile: Profile
) => {
	if (!profile) {
		return true;
	}

	if (
		promotion.institution &&
		!promotion.institution.includes(profile.institution as Institution)
	) {
		return false;
	}

	if (
		promotion.platform &&
		!promotion.platform.includes(profile.platform as PlatformOSType)
	) {
		return false;
	}

	return true;
};

export const filterPromotions = (
	promotions: PromotionResponse[],
	profile: Profile
) => {
	return promotions.filter((p) => promotionMatchesProfile(p, profile));
};
