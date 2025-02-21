import {ImpressionPlatform} from '../../../core/models/platform';

export const platformLabel = (platform: ImpressionPlatform) => {
	switch (platform) {
		case 'ios':
			return 'iOS';
		case 'android':
			return 'Android';
		default:
			return null;
	}
};
