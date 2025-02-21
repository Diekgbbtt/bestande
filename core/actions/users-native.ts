import DeviceInfo from 'react-native-device-info';
import {getProfile} from '../functions/api';
import {AppLanguage} from '../models/app-language';
import {
	errorGettingProfile,
	setUserProfile,
	startGettingProfile,
} from '../reducers/users';

export const loadUserProfile = (token: string, language: AppLanguage) => {
	return async (dispatch) => {
		dispatch(startGettingProfile());
		try {
			const response = await getProfile({
				token,
				appVersion: DeviceInfo.getVersion(),
				language,
			});
			dispatch(setUserProfile(response.data));
		} catch (err) {
			dispatch(errorGettingProfile(err));
		}
	};
};
