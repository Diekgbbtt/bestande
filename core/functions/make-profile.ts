import md5 from 'md5';
import {Platform, PlatformOSType} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {AppLanguage} from '../models/app-language';
import {Institution} from '../models/credit';
import {AppState} from '../types/app-state';

type Profile = {
	identifier: string | null;
	platform: PlatformOSType;
	language: AppLanguage;
	version: string;
	institution: Institution;
};

export const makeProfile = (state: AppState): Profile => {
	const {institution} = state.institution;
	const {username} = state.multiLogin[institution];
	const identifier = username === null ? null : md5(username);
	const platform = Platform.OS;
	const language = state.language.selectedLanguage;
	const version = DeviceInfo.getVersion();
	return {
		identifier,
		platform,
		language,
		version,
		institution,
	};
};
